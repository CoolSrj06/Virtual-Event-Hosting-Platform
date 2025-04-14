
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/VideoPlayer';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import SessionAnalytics from '@/components/SessionAnalytics';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const SessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [sessionData, setSessionData] = useState<{
    id: string;
    event_id: string;
    title: string;
    description: string | null;
    video_url: string;
    questions: {
      id: string;
      text: string;
      timestamp: number;
      username?: string;
    }[];
  } | null>(null);
  
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock real-time viewer update for demo purposes
  const [activeViewers, setActiveViewers] = useState(0);
  
  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        
        const sessionsData = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions/${sessionId}`)
          .then(res => res.json())
        
        if (!sessionsData) {
          throw new Error('Session not found');
        }
        
        // Get questions for this session
        const questions = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions/${sessionId}/questions`)
        .then (res => res.json())
        
        // Get analytics for this session
        const analytics = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions/${sessionId}/analytics`)
          .then(res => res.json())
        
        setSessionData({
          ...sessionsData,
          questions
        });
        
        setAnalyticsData(analytics);
        
        // Set initial active viewers from analytics
        if (analytics?.active_viewers) {
          setActiveViewers(analytics.active_viewers);
        }
      } catch (error) {
        console.error('Failed to fetch session data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load session data. Please try refreshing the page.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
    
    // Mock real-time viewer count update for demo purposes
    const interval = setInterval(() => {
      setActiveViewers(prev => {
        // Random fluctuation in viewers to simulate real-time changes
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(1, prev + change); // Ensure at least 1 viewer
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [sessionId, toast]);
  
  // Effect to update analyticsData when activeViewers changes
  useEffect(() => {
    if (analyticsData && activeViewers) {
      setAnalyticsData(prev => ({
        ...prev,
        active_viewers: activeViewers
      }));
    }
  }, [activeViewers, analyticsData]);

  const handleSubmitQuestion = async (questionText: string) => {
    if (!sessionId || !sessionData) return;
    
    try {
      setIsSubmitting(true);
      
      const newQuestion = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions/${sessionId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: questionText,
          username: 'Anonymous' // Replace with actual username if available
        })
      }).then(res => res.json());
      
      // Update local state
      setSessionData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: [newQuestion, ...prev.questions]
        };
      });
      
      // Update question count in analytics
      if (analyticsData) {
        const newCount = (analyticsData.questions_count || 0) + 1;
        setAnalyticsData(prev => ({
          ...prev,
          questions_count: newCount
        }));
      }
      
      toast({
        title: 'Question submitted',
        description: 'Your question has been submitted successfully.',
      });
    } catch (error) {
      console.error('Failed to submit question:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your question. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stream-background p-4">
        <div className="container max-w-7xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="aspect-video bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-stream-background p-4">
        <div className="container max-w-7xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center p-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Session not found</h3>
            <p className="text-gray-500 mb-6">The session you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stream-background">
      <div className="container max-w-7xl py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Button variant="ghost" className="mb-2 p-0" onClick={() => navigate(`/event/${sessionData.event_id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Event
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-stream-text">{sessionData.title}</h1>
            {sessionData.description && <p className="text-stream-muted">{sessionData.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-500 h-2 w-2 rounded-full animate-pulse"></div>
            <span className="font-medium">{activeViewers} Watching Now</span>
          </div>
        </div>

        <div className="mb-6">
          <VideoPlayer url={sessionData.video_url} />
        </div>

        {isMobile ? (
          <Tabs defaultValue="questions" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="ask">Ask</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="mt-4">
              <QuestionList questions={sessionData.questions} />
            </TabsContent>
            
            <TabsContent value="ask" className="mt-4">
              <QuestionForm onSubmit={handleSubmitQuestion} isLoading={isSubmitting} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-4">
              <SessionAnalytics data={analyticsData} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SessionAnalytics data={analyticsData} />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
                <QuestionForm onSubmit={handleSubmitQuestion} isLoading={isSubmitting} />
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                <QuestionList questions={sessionData.questions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;

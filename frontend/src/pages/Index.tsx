
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import QuestionForm from '@/components/QuestionForm';
import QuestionList, { Question } from '@/components/QuestionList';
import EventHeader from '@/components/EventHeader';
import ApiService from '@/services/apiService';
import websocketService from '@/services/websocketService';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [eventData, setEventData] = useState<{
    title: string;
    description: string;
    videoUrl: string;
    questions: Question[];
  }>({
    title: '',
    description: '',
    videoUrl: '',
    questions: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Fetch event data on component mount
  useEffect(() => {
    async function fetchEventData() {
      try {
        setIsLoading(true);
        const data = await ApiService.getEventData('event-123');
        setEventData(data);
      } catch (error) {
        console.error('Failed to fetch event data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load event data. Please try refreshing the page.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEventData();
  }, [toast]);
  
  // Subscribe to WebSocket messages for real-time updates
  useEffect(() => {
    const handleNewQuestion = (question: Question) => {
      setEventData(prev => ({
        ...prev,
        questions: [question, ...prev.questions]
      }));
    };
    
    websocketService.subscribe(handleNewQuestion);
    
    return () => {
      websocketService.unsubscribe(handleNewQuestion);
    };
  }, []);
  
  // Handle question submission
  const handleSubmitQuestion = async (questionText: string) => {
    try {
      setIsSubmitting(true);
      
      // Submit via API
      await ApiService.submitQuestion('event-123', questionText);
      
      // Send via WebSocket (in a real app, the backend would broadcast to all clients)
      websocketService.sendMessage(JSON.stringify({
        action: 'sendQuestion',
        eventId: 'event-123',
        text: questionText
      }));
      
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

  return (
    <div className="min-h-screen bg-stream-background">
      <div className="container max-w-6xl py-6 px-4 sm:px-6 lg:py-8">
        <EventHeader 
          title={eventData.title} 
          description={eventData.description} 
          isLoading={isLoading} 
        />

        <div className="mt-6">
          <VideoPlayer url={eventData.videoUrl} />
        </div>

        {isMobile ? (
          <Tabs defaultValue="questions" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="ask">Ask a Question</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <QuestionList questions={eventData.questions} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ask" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <QuestionForm onSubmit={handleSubmitQuestion} isLoading={isSubmitting} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Q&A</h2>
                <QuestionList questions={eventData.questions} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
                <QuestionForm onSubmit={handleSubmitQuestion} isLoading={isSubmitting} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

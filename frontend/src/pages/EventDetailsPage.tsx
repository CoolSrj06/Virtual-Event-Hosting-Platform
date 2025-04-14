import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import SessionsList from '@/components/SessionsList';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import RDSService from '@/services/rdsService';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [eventData, setEventData] = useState<{
    id: string;
    title: string;
    description: string | null;
    cover_image_url: string | null;
    created_at: string;
  } | null>(null);
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        // Fetch event details
        const event = await RDSService.getEvent(eventId);
        setEventData(event);
        
        // Fetch sessions for this event
        const sessionData = await RDSService.getSessionsForEvent(eventId);
        setSessions(sessionData);
        
        // Fetch analytics for each session
        const analyticsData: Record<string, any> = {};
        for (const session of sessionData) {
          try {
            const sessionAnalytics = await RDSService.getAnalyticsForSession(session.id);
            if (sessionAnalytics) {
              analyticsData[session.id] = sessionAnalytics;
            }
          } catch (error) {
            console.error(`Failed to fetch analytics for session ${session.id}:`, error);
          }
        }
        setAnalytics(analyticsData);
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
    };
    
    fetchEventData();
  }, [eventId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stream-background">
        <div className="container max-w-7xl py-8 px-4 sm:px-6">
          <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <div className="h-80 bg-gray-200 animate-pulse rounded-lg mb-8" />
          
          <div className="space-y-4 mb-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
          
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-stream-background">
        <div className="container max-w-7xl py-8 px-4 sm:px-6">
          <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          <div className="text-center p-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Event not found</h3>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stream-background">
      <div className="container max-w-7xl py-8 px-4 sm:px-6">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        
        <div 
          className="h-80 w-full rounded-lg bg-cover bg-center mb-8" 
          style={{ 
            backgroundImage: eventData.cover_image_url 
              ? `url(${eventData.cover_image_url})` 
              : 'url(/placeholder.svg)'
          }}
        />
        
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-stream-text md:text-4xl">
            {eventData.title}
          </h1>
          <p className="text-lg text-stream-muted">
            {eventData.description}
          </p>
          <div className="flex items-center text-sm text-stream-muted">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-4">Created {new Date(eventData.created_at).toLocaleDateString()}</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{new Date(eventData.created_at).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Event Sessions</h2>
        <SessionsList sessions={sessions} analytics={analytics} />
      </div>
    </div>
  );
};

export default EventDetailsPage;

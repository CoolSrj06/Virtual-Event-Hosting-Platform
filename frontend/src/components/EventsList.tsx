import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import RDSService from '@/services/rdsService';

interface Event {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
}

const EventsList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await RDSService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try refreshing the page.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleEventClick = (eventId: string) => { 
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500 mb-6">There are currently no events scheduled.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div 
            className="h-48 bg-cover bg-center" 
            style={{ 
              backgroundImage: event.cover_image_url 
                ? `url(${event.cover_image_url})` 
                : 'url(/placeholder.svg)'
            }}
          />
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 text-stream-text">{event.title}</h3>
            <p className="text-stream-muted mb-4 line-clamp-2">{event.description}</p>
            <Button 
              onClick={() => handleEventClick(event.id)}
              className="w-full bg-stream-primary hover:bg-stream-secondary"
            >
              View Event
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventsList;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';

interface Session {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  video_url: string;
  start_time: string | null;
  created_at: string;
}

interface SessionsListProps {
  sessions: Session[];
  analytics?: Record<string, {
    active_viewers: number | null;
    peak_viewers: number | null;
    questions_count: number | null;
  }>;
}

const SessionsList = ({ sessions, analytics }: SessionsListProps) => {
  console.log(sessions);
  
  const navigate = useNavigate();

  const getSessionStatus = (startTime: string | null) => {
    if (!startTime) return 'Not scheduled';
    
    const start = new Date(startTime);
    const now = new Date();
    
    if (start > now) {
      return 'Upcoming';
    } else {
      // For demo purposes, we'll consider sessions within the last 24 hours as "Live"
      const hoursSinceStart = (now.getTime() - start.getTime()) / (1000 * 60 * 60);
      return hoursSinceStart < 24 ? 'Live' : 'Recorded';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return <Badge className="bg-red-500">Live Now</Badge>;
      case 'Upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'Recorded':
        return <Badge className="bg-gray-500">Recorded</Badge>;
      default:
        return <Badge className="bg-gray-300">Not Scheduled</Badge>;
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return 'Not scheduled';
    
    const date = new Date(time);
    return date.toLocaleString();
  };

  const handleJoinSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No sessions found</h3>
        <p className="text-gray-500">There are currently no sessions scheduled for this event.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => {
        const status = getSessionStatus(session.start_time);
        const sessionAnalytics = analytics?.[session.id];
        
        return (
          <Card key={session.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    {session.start_time && (
                      <span className="text-sm text-stream-muted">
                        {status === 'Upcoming' 
                          ? `Starts ${formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}`
                          : `Started ${formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}`
                        }
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-stream-text">{session.title}</h3>
                  <p className="text-stream-muted">{session.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-stream-muted pt-2">
                    {session.start_time && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(session.start_time).toLocaleDateString()}</span>
                      </div>
                    )}
                    {session.start_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(session.start_time).toLocaleTimeString()}</span>
                      </div>
                    )}
                    {sessionAnalytics && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {status === 'Live' 
                            ? `${sessionAnalytics.active_viewers || 0} watching` 
                            : `${sessionAnalytics.peak_viewers || 0} peak viewers`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Button 
                    onClick={() => handleJoinSession(session.id)}
                    className="w-full md:w-auto bg-stream-primary hover:bg-stream-secondary"
                  >
                    {status === 'Live' ? 'Join Now' : (status === 'Upcoming' ? 'Set Reminder' : 'Watch Recording')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SessionsList;

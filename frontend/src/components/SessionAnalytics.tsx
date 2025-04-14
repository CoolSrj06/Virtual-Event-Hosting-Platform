
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, MessageSquare, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  id: string;
  session_id: string;
  active_viewers: number | null;
  peak_viewers: number | null;
  questions_count: number | null;
  avg_watch_time: number | null;
  timestamp: string;
}

interface SessionAnalyticsProps {
  data: AnalyticsData | null;
  isLoading?: boolean;
}

const SessionAnalytics = ({ data, isLoading = false }: SessionAnalyticsProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No analytics data available</h3>
        <p className="mt-1 text-sm text-gray-500">Analytics data will appear here once the session has started.</p>
      </div>
    );
  }

  // Format analytics data for charts
  const viewerData = [
    { name: 'Current', value: data.active_viewers || 0 },
    { name: 'Peak', value: data.peak_viewers || 0 },
  ];

  const engagementData = [
    { name: 'Questions', value: data.questions_count || 0 },
    { name: 'Avg. Watch Time (min)', value: Math.round((data.avg_watch_time || 0) / 60) },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Session Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Users className="h-10 w-10 text-blue-500" />
              <div>
                <p className="text-sm text-stream-muted">Current Viewers</p>
                <h3 className="text-2xl font-bold">{data.active_viewers || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-10 w-10 text-green-500" />
              <div>
                <p className="text-sm text-stream-muted">Peak Viewers</p>
                <h3 className="text-2xl font-bold">{data.peak_viewers || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-10 w-10 text-yellow-500" />
              <div>
                <p className="text-sm text-stream-muted">Questions</p>
                <h3 className="text-2xl font-bold">{data.questions_count || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-10 w-10 text-purple-500" />
              <div>
                <p className="text-sm text-stream-muted">Avg. Watch Time</p>
                <h3 className="text-2xl font-bold">
                  {data.avg_watch_time 
                    ? `${Math.floor(data.avg_watch_time / 60)}m ${data.avg_watch_time % 60}s` 
                    : '0m'}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Viewer Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={viewerData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionAnalytics;

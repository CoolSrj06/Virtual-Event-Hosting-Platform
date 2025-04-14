
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  timestamp: number;
  username?: string;
}

interface QuestionListProps {
  questions: Question[];
}

const QuestionList = ({ questions }: QuestionListProps) => {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 p-4 text-center bg-gray-50 rounded-lg">
        <MessageSquare className="h-12 w-12 text-stream-muted mb-2" />
        <h3 className="text-lg font-medium text-stream-text">No questions yet</h3>
        <p className="text-stream-muted">Be the first to ask a question about the video!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[350px] rounded-md border">
      <div className="p-4 space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="animate-fade-in-up">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-stream-muted">
                    {question.username || 'Anonymous'} • {new Date(question.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-2 text-stream-text">{question.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default QuestionList;

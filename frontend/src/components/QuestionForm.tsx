
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { SendIcon } from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
}

const QuestionForm = ({ onSubmit, isLoading = false }: QuestionFormProps) => {
  const [question, setQuestion] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "Question is empty",
        description: "Please type your question before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(question);
    setQuestion('');
    
    toast({
      title: "Question submitted",
      description: "Your question has been submitted successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Ask a question about the video..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="min-h-[100px] focus:border-stream-primary"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        className="w-full bg-stream-primary hover:bg-stream-secondary"
        disabled={isLoading}
      >
        <SendIcon className="mr-2 h-4 w-4" />
        Submit Question
      </Button>
    </form>
  );
};

export default QuestionForm;


import { Question } from '@/components/QuestionList';

// This is a simulated API service for demo purposes
export class ApiService {
  // Simulated event data
  private static readonly EVENT_DATA = {
    eventId: 'event-123',
    title: 'Building Scalable Web Applications',
    description: 'Learn how to build scalable and maintainable web applications using modern technologies like React, Node.js, and AWS services.',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4',
    questions: [
      {
        id: 'question_1',
        text: 'What are the best practices for state management in large React applications?',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        username: 'ReactDev'
      },
      {
        id: 'question_2',
        text: 'How do you handle authentication with JWT tokens?',
        timestamp: Date.now() - 1000 * 60 * 3, // 3 minutes ago
        username: 'SecurityExpert'
      }
    ]
  };

  // Get event data including title, description, and existing questions
  public static async getEventData(eventId: string): Promise<{
    title: string;
    description: string;
    videoUrl: string;
    questions: Question[];
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would fetch data from the actual API
    return this.EVENT_DATA;
  }

  // Submit a new question
  public static async submitQuestion(eventId: string, question: string): Promise<Question> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would send data to the actual API
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      text: question,
      timestamp: Date.now(),
      username: 'You'
    };
    
    return newQuestion;
  }
}

export default ApiService;

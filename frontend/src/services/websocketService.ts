
import { Question } from '@/components/QuestionList';

type MessageCallback = (message: Question) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private callbacks: MessageCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // In a real app, this would be provided through environment variables
  // For demo purposes, we're simulating the connection
  private socketUrl: string = "wss://demo-api.example.com";
  private isSimulated: boolean = true; // Set to true to use the simulated mock
  
  private constructor() {
    if (!this.isSimulated) {
      this.connect();
    } else {
      console.log("Using simulated WebSocket service");
    }
  }
  
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
  
  private connect(): void {
    try {
      this.socket = new WebSocket(this.socketUrl);
      
      this.socket.onopen = () => {
        console.log("WebSocket connection established");
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyCallbacks(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };
      
      this.socket.onclose = () => {
        console.log("WebSocket connection closed");
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.socket?.close();
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.attemptReconnect();
    }
  }
  
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error("Maximum reconnection attempts reached");
    }
  }
  
  public sendMessage(message: string): void {
    if (this.isSimulated) {
      this.simulateSendMessage(message);
      return;
    }
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("Cannot send message: WebSocket is not connected");
    }
  }
  
  // Simulate sending a message for demo purposes
  private simulateSendMessage(message: string): void {
    try {
      const data = JSON.parse(message);
      
      setTimeout(() => {
        // Simulate receiving the message back
        this.notifyCallbacks({
          id: `question_${Date.now()}`,
          text: data.text,
          timestamp: Date.now(),
          username: "You"
        });
      }, 500);
    } catch (e) {
      console.error("Failed to simulate message sending:", e);
    }
  }
  
  public subscribe(callback: MessageCallback): void {
    if (!this.callbacks.includes(callback)) {
      this.callbacks.push(callback);
    }
  }
  
  public unsubscribe(callback: MessageCallback): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }
  
  private notifyCallbacks(message: Question): void {
    this.callbacks.forEach(callback => {
      callback(message);
    });
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.callbacks = [];
  }
}

export default WebSocketService.getInstance();

// Chat utility functions
import { ChatMessage } from '@/types';

export const filterMessagesByEvent = (messages: ChatMessage[], eventId: string): ChatMessage[] => {
  return messages.filter(message => message.eventId === eventId);
};

export const sortMessagesByTimestamp = (messages: ChatMessage[]): ChatMessage[] => {
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const isValidMessage = (text: string): boolean => {
  return text.trim().length > 0;
};
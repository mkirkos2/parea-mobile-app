// Event Data Model
export interface User {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
  interests: string[];
  verified: boolean;
  createdAt: Date;
}

// Event category type
export type EventCategory = 
  | 'coffee'
  | 'walk'
  | 'escapeRoom'
  | 'music'
  | 'boardGames'
  | 'language'
  | 'art'
  | 'sports'
  | 'food'
  | 'volunteering';

// Participation modes
export type ParticipationMode = 'open' | 'approval';

// Participation status
export type ParticipationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: Date;
  time: string; // HH:mm format
  duration: number; // in minutes
  area: string;
  meetingPoint: string;
  attendees: string[]; // user IDs
  capacity: number;
  host: string; // user ID
  participationMode: ParticipationMode;
  firstTimeFriendly: boolean;
  mostlySolo: boolean;
  cost: number; // 0 for free
  requirements: string[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export type ReportReason = 
  | 'harassment'
  | 'misleadingEvent'
  | 'dangerousBehavior'
  | 'spam'
  | 'impersonation'
  | 'other';

export interface Report {
  id: string;
  type: 'event' | 'user';
  targetId: string;
  reason: ReportReason;
  description?: string;
  reporterId: string;
  timestamp: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  date: Date;
  time: string;
  duration: number;
  area: string;
  meetingPoint: string;
  capacity: number;
  cost: number;
  requirements: string[];
  participationMode: ParticipationMode;
  firstTimeFriendly: boolean;
  mostlySolo: boolean;
}
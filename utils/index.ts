// Utility functions for the app
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5); // Remove seconds if present
};

export const isEventFull = (event: any): boolean => {
  return event.attendees.length >= event.capacity;
};

export const isUserParticipating = (eventId: string, participations: Record<string, any>): boolean => {
  return participations[eventId] !== undefined;
};

export const getUserParticipationStatus = (eventId: string, participations: Record<string, any>): string | null => {
  return participations[eventId] || null;
};

export const canUserJoinEvent = (event: any, participations: Record<string, any>): boolean => {
  return !isEventFull(event) && !isUserParticipating(event.id, participations);
};

export const canUserCancelParticipation = (eventId: string, participations: Record<string, any>): boolean => {
  return isUserParticipating(eventId, participations);
};
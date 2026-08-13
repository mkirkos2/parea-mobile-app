// App Context for Global State Management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, User, ChatMessage, ParticipationStatus, Report } from '@/types';

interface AppContextType {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Onboarding state
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (completed: boolean) => void;
  
  // App loading state
  isHydrated: boolean;
  
  // Events state
  events: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  
  // Favorites state
  favorites: string[]; // event IDs
  toggleFavorite: (eventId: string) => void;
  
  // Participation state
  participations: Record<string, ParticipationStatus>; // event ID -> status
  joinEvent: (eventId: string) => void;
  cancelParticipation: (eventId: string) => void;
  
  // Created events
  createdEvents: Event[];
  addCreatedEvent: (event: Event) => void;
  
  // Chat messages
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  
  // Reports
  reports: Report[];
  addReport: (report: Report) => void;
  
  // Reset data
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Onboarding state
  const [isOnboardingCompleted, setIsOnboardingCompletedBase] = useState(false);
  
  // Wrapper function to persist onboarding completion
  const setIsOnboardingCompleted = async (completed: boolean) => {
    try {
      if (completed) {
        await AsyncStorage.setItem('@parea/onboardingCompleted', 'true');
      } else {
        await AsyncStorage.removeItem('@parea/onboardingCompleted');
      }
      setIsOnboardingCompletedBase(completed);
    } catch (error) {
      console.error('Error saving onboarding completion status:', error);
    }
  };
  
  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  
  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Participation state
  const [participations, setParticipations] = useState<Record<string, ParticipationStatus>>({});
  
  // Created events
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [isCreatedEventsHydrated, setIsCreatedEventsHydrated] = useState(false);
  
  // App hydration state
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Reports
  const [reports, setReports] = useState<Report[]>([]);

  // Load data from AsyncStorage on app start
  useEffect(() => {
const loadData = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('@parea/onboardingCompleted');
        setIsOnboardingCompleted(onboardingCompleted === 'true');
        
        const storedFavorites = await AsyncStorage.getItem('@parea/favorites');
        if (storedFavorites) {
          try {
            const parsedFavorites = JSON.parse(storedFavorites);
            if (Array.isArray(parsedFavorites)) {
              setFavorites(parsedFavorites);
            } else {
              setFavorites([]);
            }
          } catch (parseError) {
            console.error('Error parsing favorites:', parseError);
            setFavorites([]);
          }
        }
        
        const storedParticipations = await AsyncStorage.getItem('@parea/participations');
        if (storedParticipations) {
          try {
            const parsedParticipations = JSON.parse(storedParticipations);
            if (typeof parsedParticipations === 'object' && parsedParticipations !== null) {
              setParticipations(parsedParticipations);
            } else {
              setParticipations({});
            }
          } catch (parseError) {
            console.error('Error parsing participations:', parseError);
            setParticipations({});
          }
        }
        
        const storedCreatedEvents = await AsyncStorage.getItem('@parea/createdEvents');
        if (storedCreatedEvents) {
          try {
            const parsedEvents = JSON.parse(storedCreatedEvents);
            // Handle legacy string array format
            if (Array.isArray(parsedEvents) && parsedEvents.length > 0 && typeof parsedEvents[0] === 'string') {
              console.warn('Legacy createdEvents format detected, migrating to empty array');
              setCreatedEvents([]);
            } else {
              // Validate that it's an array of Event objects
              if (Array.isArray(parsedEvents)) {
                // Normalize events to ensure they have all required fields
                const normalizedEvents = parsedEvents.map(event => ({
                  // Provide default values for all required fields
                  id: event.id || Math.random().toString(36).substring(7),
                  title: event.title || 'Χωρίς Τίτλο',
                  description: event.description || '',
                  category: event.category || 'coffee',
                  date: event.date ? new Date(event.date) : new Date(),
                  time: event.time || '12:00',
                  duration: typeof event.duration === 'number' ? event.duration : 60,
                  area: event.area || '',
                  meetingPoint: event.meetingPoint || '',
                  attendees: Array.isArray(event.attendees) ? event.attendees : [],
                  capacity: typeof event.capacity === 'number' ? event.capacity : 10,
                  host: event.host || '',
                  participationMode: event.participationMode || 'open',
                  firstTimeFriendly: typeof event.firstTimeFriendly === 'boolean' ? event.firstTimeFriendly : false,
                  mostlySolo: typeof event.mostlySolo === 'boolean' ? event.mostlySolo : true,
                  cost: typeof event.cost === 'number' ? event.cost : 0,
                  requirements: Array.isArray(event.requirements) ? event.requirements : [],
                  createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
                }));
                setCreatedEvents(normalizedEvents);
              } else {
                setCreatedEvents([]);
              }
            }
          } catch (parseError) {
            console.error('Error parsing createdEvents:', parseError);
            setCreatedEvents([]);
          }
        }
        // Mark created events as hydrated
        setIsCreatedEventsHydrated(true);
        
        // Mark overall app context as hydrated
        setIsHydrated(true);
        
        const storedMessages = await AsyncStorage.getItem('@parea/messages');
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages);
            // Validate that it's a Record<string, ChatMessage[]>
            if (typeof parsedMessages === 'object' && parsedMessages !== null) {
              const messagesArray = Object.values(parsedMessages).flat() as ChatMessage[];
              setMessages(messagesArray);
            } else {
              setMessages([]);
            }
          } catch (parseError) {
            console.error('Error parsing messages:', parseError);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    
    loadData();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to AsyncStorage:', error);
      }
    };
    
    saveFavorites();
  }, [favorites]);

  // Save participations to AsyncStorage whenever they change
  useEffect(() => {
    const saveParticipations = async () => {
      try {
        await AsyncStorage.setItem('participations', JSON.stringify(participations));
      } catch (error) {
        console.error('Error saving participations to AsyncStorage:', error);
      }
    };
    
    saveParticipations();
  }, [participations]);

  // Save created events to AsyncStorage whenever they change
  useEffect(() => {
    // Don't save if not hydrated yet to prevent overwriting stored data with empty array
    if (!isCreatedEventsHydrated) {
      return;
    }
    
    const saveCreatedEvents = async () => {
      try {
        await AsyncStorage.setItem('@parea/createdEvents', JSON.stringify(createdEvents));
      } catch (error) {
        console.error('Error saving created events to AsyncStorage:', error);
      }
    };
    
    saveCreatedEvents();
  }, [createdEvents, isCreatedEventsHydrated]);
  
  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        // Group messages by eventId
        const messagesByEvent: Record<string, ChatMessage[]> = {};
        messages.forEach(message => {
          if (!messagesByEvent[message.eventId]) {
            messagesByEvent[message.eventId] = [];
          }
          messagesByEvent[message.eventId].push(message);
        });
        
        await AsyncStorage.setItem('@parea/messages', JSON.stringify(messagesByEvent));
      } catch (error) {
        console.error('Error saving messages to AsyncStorage:', error);
      }
    };
    
    saveMessages();
  }, [messages]);

  // Toggle favorite status for an event
  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  // Join an event
  const joinEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // For open events, approve immediately
    if (event.participationMode === 'open') {
      setParticipations(prev => ({
        ...prev,
        [eventId]: 'approved'
      }));
      
      // Add user to attendees
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, attendees: [...e.attendees, ''] } 
          : e
      ));
    } 
    // For approval events, set as pending
    else {
      setParticipations(prev => ({
        ...prev,
        [eventId]: 'pending'
      }));
    }
  };

  // Cancel participation in an event
  const cancelParticipation = (eventId: string) => {
    setParticipations(prev => {
      const newState = { ...prev };
      delete newState[eventId];
      return newState;
    });
    
    // Remove user from attendees
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, attendees: e.attendees.filter(id => id !== '') } 
        : e
    ));
  };

  // Add a new event
  const addEvent = (event: Event) => {
    setEvents(prev => [event, ...prev]);
  };

  // Add a created event
  const addCreatedEvent = (event: Event) => {
    setCreatedEvents(prev => [...prev, event]);
  };

  // Add a chat message
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  // Add a report
  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  // Reset all demo data
  const resetDemoData = async () => {
    try {
      // Clear all AsyncStorage data except onboarding
      await AsyncStorage.removeItem('@parea/favorites');
      await AsyncStorage.removeItem('@parea/participations');
      await AsyncStorage.removeItem('@parea/createdEvents');
      await AsyncStorage.removeItem('@parea/messages');
      
      setFavorites([]);
      setParticipations({});
      setCreatedEvents([]);
      
      // Reload demo data
      const demoEvents = (await import('@/data/events')).default;
      const demoMessages = (await import('@/data/messages')).default;
      
      setEvents(demoEvents);
      setMessages(demoMessages);
      setReports([]);
    } catch (error) {
      console.error('Error resetting demo data:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      isOnboardingCompleted,
      setIsOnboardingCompleted,
      isHydrated,
      events,
      setEvents,
      addEvent,
      favorites,
      toggleFavorite,
      participations,
      joinEvent,
      cancelParticipation,
      createdEvents,
      addCreatedEvent,
      messages,
      addMessage,
      reports,
      addReport,
      resetDemoData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
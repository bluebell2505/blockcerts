import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  image: string;
  maxParticipants: number;
  registeredCount: number;
}

export interface User {
  id: string;
  userId: string;
  password: string;
  walletId?: string;
  department?: string;
  year?: string;
  isAdmin?: boolean;
}

export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  teamMembers: TeamMember[];
  registrationDate: string;
  attended: boolean;
  certificateIssued: boolean;
  qrCode: string;
}

export interface TeamMember {
  name: string;
  email: string;
  id: string;
}

interface AppContextType {
  user: User | null;
  events: Event[];
  participants: Participant[];
  login: (userId: string, password: string, isAdmin?: boolean) => boolean;
  logout: () => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  registerForEvent: (eventId: string, teamMembers: TeamMember[]) => string;
  markAttendance: (participantId: string) => void;
  issueCertificate: (participantId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Sample data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join us for an exciting day of technological innovation, featuring keynote speakers from top tech companies, interactive workshops, and networking opportunities.',
    date: '2024-12-15',
    time: '09:00 AM',
    venue: 'Main Auditorium, Tech Campus',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    maxParticipants: 500,
    registeredCount: 245
  },
  {
    id: '2',
    title: 'Annual Cultural Fest',
    description: 'Experience the vibrant culture and traditions through dance, music, art exhibitions, and food stalls from around the world.',
    date: '2024-12-20',
    time: '04:00 PM',
    venue: 'Campus Grounds',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    maxParticipants: 1000,
    registeredCount: 678
  },
  {
    id: '3',
    title: 'Startup Pitch Competition',
    description: 'Aspiring entrepreneurs present their innovative ideas to a panel of investors and industry experts for a chance to win funding.',
    date: '2024-12-25',
    time: '10:00 AM',
    venue: 'Business Incubator Hall',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    maxParticipants: 200,
    registeredCount: 156
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering the latest trends in artificial intelligence and machine learning with practical coding sessions.',
    date: '2024-12-30',
    time: '02:00 PM',
    venue: 'Computer Lab A',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    maxParticipants: 100,
    registeredCount: 89
  }
];

const sampleUsers: User[] = [
  { id: '1', userId: 'admin', password: 'admin123', isAdmin: true },
  { id: '2', userId: 'student1', password: 'pass123', department: 'Computer Science', year: '3rd', isAdmin: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const login = (userId: string, password: string, isAdmin: boolean = false): boolean => {
    const foundUser = sampleUsers.find(
      u => u.userId === userId && u.password === password && (u.isAdmin || false) === isAdmin
    );
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const registerForEvent = (eventId: string, teamMembers: TeamMember[]): string => {
    if (!user) return '';
    
    const qrCode = `QR-${Date.now()}-${user.id}-${eventId}`;
    const newParticipant: Participant = {
      id: Date.now().toString(),
      eventId,
      userId: user.id,
      userName: user.userId,
      userEmail: `${user.userId}@college.edu`,
      teamMembers,
      registrationDate: new Date().toISOString(),
      attended: false,
      certificateIssued: false,
      qrCode
    };
    
    setParticipants(prev => [...prev, newParticipant]);
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, registeredCount: event.registeredCount + 1 }
        : event
    ));
    
    return qrCode;
  };

  const markAttendance = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, attended: true } : p
    ));
  };

  const issueCertificate = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, certificateIssued: true } : p
    ));
  };

  return (
    <AppContext.Provider value={{
      user,
      events,
      participants,
      login,
      logout,
      addEvent,
      registerForEvent,
      markAttendance,
      issueCertificate
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
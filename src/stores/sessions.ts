import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { RowingSession, Boat, Comment } from '../types';
import { mockSessions, currentUser } from '../mock/data';

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<RowingSession[]>(mockSessions);

  const sessionsByDate = computed(() => {
    const grouped = sessions.value.reduce((acc, session) => {
      const date = session.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {} as Record<string, RowingSession[]>);

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, sessions]) => ({ date, sessions }));
  });

  const addSession = (session: Omit<RowingSession, 'id' | 'boats' | 'comments'>) => {
    const newSession: RowingSession = {
      ...session,
      id: Math.random().toString(36).substring(2, 9),
      boats: [],
      comments: [],
    };
    sessions.value.push(newSession);
  };

  const addBoat = (sessionId: string, boatType: Boat['type']) => {
    const session = sessions.value.find(s => s.id === sessionId);
    if (!session) return;

    const newBoat: Boat = {
      id: Math.random().toString(36).substring(2, 9),
      type: boatType,
      participants: [],
    };
    session.boats.push(newBoat);
    return newBoat;
  };

  const joinBoat = (sessionId: string, boatId: string) => {
    const session = sessions.value.find(s => s.id === sessionId);
    if (!session) return;

    const boat = session.boats.find(b => b.id === boatId);
    if (!boat) return;

    boat.participants.push({
      userId: currentUser.id,
      status: 'confirmed',
    });
  };

  const addComment = (sessionId: string, text: string, boatPreference?: Boat['type']) => {
    const session = sessions.value.find(s => s.id === sessionId);
    if (!session) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      boatPreference,
    };
    session.comments.push(newComment);
  };

  return {
    sessions,
    sessionsByDate,
    addSession,
    addBoat,
    joinBoat,
    addComment,
  };
});
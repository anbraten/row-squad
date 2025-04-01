import { User, RowingSlot, RowingSession } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Emma', avatar: '👩' },
  { id: '2', name: 'James', avatar: '🧔' },
  { id: '3', name: 'Sophie', avatar: '👱‍♀️' },
  { id: '4', name: 'Mike', avatar: '👨‍🦰' },
];

export const mockSlots: RowingSlot[] = [
  { id: '1', startTime: '17:00', endTime: '20:00', maxParticipants: 8 },
  { id: '2', startTime: '17:30', endTime: '20:30', maxParticipants: 8 },
];

export const mockSessions: RowingSession[] = [
  {
    id: '1',
    slotId: '1',
    date: '2024-03-20',
    boats: [
      {
        id: '1',
        type: '4x',
        participants: [
          { userId: '1', status: 'confirmed' },
          { userId: '2', status: 'maybe' },
        ],
      },
    ],
    supervisor: '1',
    comments: [
      {
        id: '1',
        userId: '2',
        text: "I'd love to join! Prefer a quad if possible.",
        timestamp: '2024-03-20T10:00:00Z',
        boatPreference: '4x',
      },
    ],
  },
];

export const currentUser: User = mockUsers[0];
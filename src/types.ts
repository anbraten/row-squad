export interface User {
	id: string;
	name: string;
	avatar: string;
}

export interface RowingSlot {
	id: string;
	startTime: string;
	endTime: string;
	maxParticipants: number;
}

export interface Boat {
	id: string;
	type: "1x" | "2x" | "4x" | "8+";
	participants: Participant[];
}

export interface RowingSession {
	id: string;
	slotId: string;
	date: string;
	boats: Boat[];
	supervisor: string; // userId of the supervisor
	comments: Comment[];
}

export type Participant = string;

export interface Comment {
	id: string;
	userId: string;
	text: string;
	timestamp: string;
	boatPreference?: "1x" | "2x" | "4x" | "8+";
}

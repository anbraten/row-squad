import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { RowingSession, Boat, Comment } from "../types";
import { mockSessions, currentUser } from "../mock/data";

export const useSessionsStore = defineStore("sessions", () => {
	const sessions = ref<RowingSession[]>(mockSessions);

	const sessionsByDate = computed(() => {
		const grouped = sessions.value.reduce(
			(acc, session) => {
				const date = session.date;
				if (!acc[date]) {
					acc[date] = [];
				}
				acc[date].push(session);
				return acc;
			},
			{} as Record<string, RowingSession[]>,
		);

		return Object.entries(grouped)
			.sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
			.map(([date, sessions]) => ({ date, sessions }));
	});

	function addSession(
		session: Omit<RowingSession, "id" | "boats" | "comments">,
	) {
		const newSession: RowingSession = {
			...session,
			id: Math.random().toString(36).substring(2, 9),
			boats: [],
			comments: [],
		};
		sessions.value.push(newSession);
	}

	function addBoat(sessionId: string, boatType: Boat["type"]) {
		const session = sessions.value.find((s) => s.id === sessionId);
		if (!session) return;

		const newBoat: Boat = {
			id: Math.random().toString(36).substring(2, 9),
			type: boatType,
			participants: [],
		};
		session.boats.push(newBoat);
		return newBoat;
	}

	function removeBoat(sessionId: string, boatId: string) {
		const session = sessions.value.find((s) => s.id === sessionId);
		if (!session) return;

		session.boats = session.boats.filter((b) => b.id !== boatId);
	}

	function joinBoat(sessionId: string, boatId: string) {
		const session = sessions.value.find((s) => s.id === sessionId);
		if (!session) return;

		const boat = session.boats.find((b) => b.id === boatId);
		if (!boat) return;

		// leave all other boats of that session
		for (const boat of session.boats) {
			if (boat.participants.includes(sessionId)) {
				leaveBoat(sessionId, boat.id);
			}
		}

		boat.participants.push(sessionId);
	}

	function leaveBoat(sessionId: string, boatId: string) {
		const session = sessions.value.find((s) => s.id === sessionId);
		if (!session) return;

		const boat = session.boats.find((b) => b.id === boatId);
		if (!boat) return;

		boat.participants = boat.participants.filter((p) => p != sessionId);

		if (boat.participants.length === 0) {
			removeBoat(sessionId, boatId);
		}
	}

	function addComment(
		sessionId: string,
		text: string,
		boatPreference?: Boat["type"],
	) {
		const session = sessions.value.find((s) => s.id === sessionId);
		if (!session) return;

		const newComment: Comment = {
			id: Math.random().toString(36).substring(2, 9),
			userId: currentUser.id,
			text,
			timestamp: new Date().toISOString(),
			boatPreference,
		};
		session.comments.push(newComment);
	}

	return {
		sessions,
		sessionsByDate,
		addSession,
		addBoat,
		removeBoat,
		joinBoat,
		leaveBoat,
		addComment,
	};
});

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Rowing Timeline</h2>
      <button @click="showNewSession = true" class="btn btn-primary">
        New Event 🚣
      </button>
    </div>

    <div class="space-y-8">
      <div v-for="{ date, sessions } in sessionsByDate" :key="date" class="space-y-4">
        <h3 class="text-lg font-medium text-gray-700">
          {{ formatDate(date) }}
        </h3>

        <div class="space-y-4">
          <div v-for="session in sessions" :key="session.id"
               class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <!-- Event Header -->
            <div class="flex justify-between items-start mb-6">
              <div>
                <h4 class="font-semibold text-lg">
                  {{ formatTime(session.slotId) }}
                </h4>
                <p class="text-sm text-gray-600 flex items-center gap-2">
                  <!-- <span>{{ session.type === 'beach-trip' ? '🏖️ Beach Trip' :
                         session.type === 'training' ? '💪 Training' : '🚣 Casual Row' }}</span> -->
                  <!-- <span class="text-gray-400">•</span> -->
                  <span class="flex items-center gap-1">
                    Supervisor:
                    <Avatar :user="session.supervisor" />
                    <span>{{ getUserName(session.supervisor) }}</span>
                  </span>
                </p>
              </div>
              <button @click="() => showNewBoatModal(session.id)"
                      class="text-rowing-blue hover:bg-rowing-light/10 rounded-lg px-3 py-1">
                + Add Boat
              </button>
            </div>

            <!-- Boats -->
            <div class="space-y-4 mb-6">
              <div v-for="boat in session.boats" :key="boat.id"
                   class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">{{ boat.type === '8+' ? '🚤' : '🛶' }}</span>
                    <span class="font-medium">{{ boat.type }}</span>
                  </div>
                  <button v-if="!isParticipatingInBoat(boat)"
                          @click="joinBoat(session.id, boat.id)"
                          class="btn btn-primary text-sm">
                    Join Boat
                  </button>
                  <span v-else class="text-green-600 font-medium">You're in! 🎉</span>
                </div>

                <div class="flex flex-wrap gap-2">
                  <div v-for="participant in boat.participants" :key="participant.userId"
                       class="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                    <Avatar :user="participant.userId" />
                    <span class="text-sm">{{ getUserName(participant.userId) }}</span>
                    <span v-if="participant.status === 'maybe'"
                          class="text-xs text-gray-500">(maybe)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div class="border-t pt-4 space-y-4">
              <div v-for="comment in session.comments" :key="comment.id" class="flex gap-3">
                <div class="flex-shrink-0">
                  <Avatar :user="comment.userId" />
                </div>
                <div class="flex-grow">
                  <div class="flex items-baseline gap-2">
                    <span class="font-medium">{{ getUserName(comment.userId) }}</span>
                    <span class="text-sm text-gray-500">
                      {{ formatTimestamp(comment.timestamp) }}
                    </span>
                  </div>
                  <p class="text-gray-700">{{ comment.text }}</p>
                  <div v-if="comment.boatPreference" class="mt-1 text-sm text-gray-600">
                    Prefers: {{ comment.boatPreference }}
                  </div>
                </div>
              </div>

              <!-- New Comment Form -->
              <form @submit.prevent="addComment(session.id)" class="flex gap-3">
                <div class="flex-shrink-0 flex items-center">
                  <Avatar :user="currentUser.id" />
                </div>
                <div class="flex-grow">
                  <input v-model="newComments[session.id]"
                         type="text"
                         placeholder="Add a comment..."
                         class="w-full rounded-lg border-gray-300 text-sm" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Session Modal -->
    <TransitionRoot appear :show="showNewSession" as="template">
      <Dialog as="div" @close="showNewSession = false" class="relative z-10">
        <div class="fixed inset-0 bg-black bg-opacity-25" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                Create New Event
              </DialogTitle>

              <form @submit.prevent="createSession" class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" v-model="newSessionData.date"
                         class="mt-1 block w-full rounded-md border-gray-300" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Time Slot</label>
                  <select v-model="newSessionData.slotId" class="mt-1 block w-full rounded-md border-gray-300">
                    <option v-for="slot in slots" :key="slot.id" :value="slot.id">
                      {{ slot.startTime }} - {{ slot.endTime }}
                    </option>
                  </select>
                </div>

                <!-- <div>
                  <label class="block text-sm font-medium text-gray-700">Event Type</label>
                  <select v-model="newSessionData.type" class="mt-1 block w-full rounded-md border-gray-300">
                    <option value="training">Training 💪</option>
                    <option value="beach-trip">Beach Trip 🏖️</option>
                    <option value="casual">Casual Row 🚣</option>
                  </select>
                </div> -->

                <div class="mt-6 flex justify-end gap-3">
                  <button type="button" @click="showNewSession = false" class="btn bg-gray-200 hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Create Event
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- New Boat Modal -->
    <TransitionRoot appear :show="showNewBoat" as="template">
      <Dialog as="div" @close="showNewBoat = false" class="relative z-10">
        <div class="fixed inset-0 bg-black bg-opacity-25" />

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                Add New Boat
              </DialogTitle>

              <form @submit.prevent="createBoat" class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Boat Type</label>
                  <select v-model="newBoatType" class="mt-1 block w-full rounded-md border-gray-300">
                    <option value="1x">Single (1x)</option>
                    <option value="2x">Double (2x)</option>
                    <option value="4x">Quad (4x)</option>
                    <option value="8+">Eight (8+)</option>
                  </select>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button type="button" @click="showNewBoat = false" class="btn bg-gray-200 hover:bg-gray-300">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Add Boat
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue';
import { format } from 'date-fns';
import { useSessionsStore } from '~/stores/sessions';
import { mockUsers, mockSlots, currentUser } from '~/mock/data';
import type { Boat } from '~/types';
import Avatar from '~/components/Avatar.vue';

const sessionsStore = useSessionsStore();
const sessionsByDate = computed(() => sessionsStore.sessionsByDate);
const slots = mockSlots;

const showNewSession = ref(false);
const showNewBoat = ref(false);
const selectedSessionId = ref('');
const newBoatType = ref<Boat['type']>('4x');
const newComments = ref<Record<string, string>>({});

const newSessionData = ref({
  date: new Date().toISOString().split('T')[0],
  slotId: slots[0].id,
  type: 'casual' as const,
});

const formatDate = (date: string) => {
  return format(new Date(date), 'EEEE, MMMM d');
};

const formatTime = (slotId: string) => {
  const slot = slots.find(s => s.id === slotId);
  return slot ? `${slot.startTime} - ${slot.endTime}` : '';
};

const formatTimestamp = (timestamp: string) => {
  return format(new Date(timestamp), 'HH:mm');
};

const getUserName = (userId: string) => {
  return mockUsers.find(u => u.id === userId)?.name || 'Unknown';
};

const isParticipatingInBoat = (boat: Boat) => {
  return boat.participants.some(p => p.userId === currentUser.id);
};

const showNewBoatModal = (sessionId: string) => {
  selectedSessionId.value = sessionId;
  showNewBoat.value = true;
};

const createSession = () => {
  sessionsStore.addSession({
    ...newSessionData.value,
    supervisor: currentUser.id,
  });
  showNewSession.value = false;
};

const createBoat = () => {
  const boat = sessionsStore.addBoat(selectedSessionId.value, newBoatType.value);
  if (boat)
    sessionsStore.joinBoat(selectedSessionId.value, boat.id);
  showNewBoat.value = false;
};

const joinBoat = (sessionId: string, boatId: string) => {
  sessionsStore.joinBoat(sessionId, boatId);
};

const addComment = (sessionId: string) => {
  const text = newComments.value[sessionId];
  if (!text?.trim()) return;

  sessionsStore.addComment(sessionId, text);
  newComments.value[sessionId] = '';
};
</script>
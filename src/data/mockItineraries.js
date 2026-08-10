// Dynamic Itinerary Builder Data Model
export const INITIAL_ITINERARY = [
  {
    day: 1,
    date: 'Day 1',
    title: 'Embarkation Day',
    port: 'Home Port',
    type: 'embarkation',
    status: 'today',
    weather: '84°F ☀️ Sunny',
    events: []
  },
  {
    day: 2,
    date: 'Day 2',
    title: 'Port of Call',
    port: 'Island / Coastal Destination',
    type: 'port',
    status: 'upcoming',
    weather: '86°F 🌤️ Tropical',
    events: []
  },
  {
    day: 3,
    date: 'Day 3',
    title: 'Fun Day at Sea',
    port: 'Open Ocean',
    type: 'sea',
    status: 'upcoming',
    weather: '82°F 🌊 Calm Seas',
    events: []
  }
];

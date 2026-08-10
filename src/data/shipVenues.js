export const SHIP_VENUES = [
  { id: 'lido_pool', name: 'Lido Deck Main Pool', deck: 'Deck 15', type: 'Pool & Bar' },
  { id: 'schooner_bar', name: 'Schooner Piano Bar', deck: 'Deck 6', type: 'Cocktails & Music' },
  { id: 'solarium', name: 'Adults Only Solarium', deck: 'Deck 14', type: 'Relaxation' },
  { id: 'central_park', name: 'Central Park Garden', deck: 'Deck 8', type: 'Promenade & Dining' },
  { id: 'chops_grille', name: 'Chops Grille Steakhouse', deck: 'Deck 8', type: 'Specialty Dining' },
  { id: 'aqua_theater', name: 'AquaTheater Stage', deck: 'Deck 6', type: 'Live Entertainment' },
  { id: 'casino_royale', name: 'Casino Royale', deck: 'Deck 4', type: 'Gaming & Nightlife' },
  { id: 'spotlight_karaoke', name: 'Spotlight Karaoke Lounge', deck: 'Deck 5', type: 'Bar & Music' },
  { id: 'promenade_cafe', name: 'Royal Promenade Café', deck: 'Deck 5', type: '24/7 Dining & Snacks' },
  { id: 'sports_deck', name: 'FlowRider & Sports Deck', deck: 'Deck 16', type: 'Activities' },
  { id: 'observation_deck', name: 'Forward Observation Deck', deck: 'Deck 17', type: 'Scenic View' }
];

export const SHIP_DETAILS = {
  wonder: {
    id: 'wonder',
    name: 'Wonder of the Seas',
    cruiseLine: 'Royal Caribbean',
    cruiseLineCode: 'RCCL',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80',
    capacity: '6,988 guests',
    totalDecks: 18,
    activeSailingsCount: 1420,
    currentVoyage: '7-Night Western Caribbean & Perfect Day',
    dates: 'Jul 12, 2026 - Jul 19, 2026',
    homePort: 'Port Canaveral, FL',
    ports: ['Port Canaveral', 'Perfect Day at CocoCay', 'Cozumel', 'Roatan', 'Costa Maya']
  },
  celebration: {
    id: 'celebration',
    name: 'Carnival Celebration',
    cruiseLine: 'Carnival Cruise Line',
    cruiseLineCode: 'CARN',
    image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=1200&q=80',
    capacity: '6,500 guests',
    totalDecks: 19,
    activeSailingsCount: 1180,
    currentVoyage: '7-Night Eastern Caribbean Fun',
    dates: 'Jul 15, 2026 - Jul 22, 2026',
    homePort: 'Miami, FL',
    ports: ['Miami', 'San Juan', 'Amber Cove', 'St. Thomas']
  },
  viva: {
    id: 'viva',
    name: 'Norwegian Viva',
    cruiseLine: 'Norwegian Cruise Line',
    cruiseLineCode: 'NCL',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
    capacity: '3,099 guests',
    totalDecks: 20,
    activeSailingsCount: 890,
    currentVoyage: '9-Night Greek Isles & Italy',
    dates: 'Aug 02, 2026 - Aug 11, 2026',
    homePort: 'Rome (Civitavecchia), Italy',
    ports: ['Rome', 'Santorini', 'Mykonos', 'Naples', 'Florence']
  }
};

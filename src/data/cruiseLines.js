export const CRUISE_LINES = [
  {
    id: 'rccl',
    name: 'Royal Caribbean International',
    code: 'RCCL',
    color: '#0284c7',
    badgeGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    loyaltyProgram: 'Crown & Anchor Society',
    tiers: ['Gold', 'Platinum', 'Emerald', 'Diamond', 'Diamond Plus', 'Pinnacle Club'],
    ships: [
      { id: 'wonder', name: 'Wonder of the Seas', class: 'Oasis Class', capacity: '6,988 guests' },
      { id: 'icon', name: 'Icon of the Seas', class: 'Icon Class', capacity: '7,600 guests' },
      { id: 'symphony', name: 'Symphony of the Seas', class: 'Oasis Class', capacity: '6,680 guests' },
      { id: 'odyssey', name: 'Odyssey of the Seas', class: 'Quantum Ultra Class', capacity: '5,498 guests' }
    ]
  },
  {
    id: 'carnival',
    name: 'Carnival Cruise Line',
    code: 'CARN',
    color: '#dc2626',
    badgeGradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    loyaltyProgram: 'VIFP Club (Very Important Fun Person)',
    tiers: ['Blue', 'Red', 'Gold', 'Platinum', 'Diamond'],
    ships: [
      { id: 'celebration', name: 'Carnival Celebration', class: 'Excel Class', capacity: '6,500 guests' },
      { id: 'jubilee', name: 'Carnival Jubilee', class: 'Excel Class', capacity: '6,500 guests' },
      { id: 'mardi_gras', name: 'Mardi Gras', class: 'Excel Class', capacity: '6,500 guests' },
      { id: 'horizon', name: 'Carnival Horizon', class: 'Vista Class', capacity: '3,960 guests' }
    ]
  },
  {
    id: 'ncl',
    name: 'Norwegian Cruise Line',
    code: 'NCL',
    color: '#2563eb',
    badgeGradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    loyaltyProgram: 'Latitudes Rewards',
    tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Sapphire', 'Diamond', 'Ambassador'],
    ships: [
      { id: 'viva', name: 'Norwegian Viva', class: 'Prima Class', capacity: '3,099 guests' },
      { id: 'prima', name: 'Norwegian Prima', class: 'Prima Class', capacity: '3,099 guests' },
      { id: 'encore', name: 'Norwegian Encore', class: 'Breakaway Plus', capacity: '3,998 guests' },
      { id: 'bliss', name: 'Norwegian Bliss', class: 'Breakaway Plus', capacity: '4,004 guests' }
    ]
  },
  {
    id: 'celebrity',
    name: 'Celebrity Cruises',
    code: 'CEL',
    color: '#4f46e5',
    badgeGradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
    loyaltyProgram: 'Captains Club',
    tiers: ['Preview', 'Classic', 'Select', 'Elite', 'Elite Plus', 'Zenith'],
    ships: [
      { id: 'beyond', name: 'Celebrity Beyond', class: 'Edge Class', capacity: '3,260 guests' },
      { id: 'ascent', name: 'Celebrity Ascent', class: 'Edge Class', capacity: '3,260 guests' },
      { id: 'apex', name: 'Celebrity Apex', class: 'Edge Class', capacity: '2,910 guests' }
    ]
  },
  {
    id: 'virgin',
    name: 'Virgin Voyages',
    code: 'VIRGIN',
    color: '#e11d48',
    badgeGradient: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
    loyaltyProgram: 'Sailing Club',
    tiers: ['Sea Rover', 'Sea-Pass Gold', 'Deep Blue Extra'],
    ships: [
      { id: 'scarlet', name: 'Scarlet Lady', class: 'Lady Ship', capacity: '2,770 sailors' },
      { id: 'valiant', name: 'Valiant Lady', class: 'Lady Ship', capacity: '2,770 sailors' },
      { id: 'resilient', name: 'Resilient Lady', class: 'Lady Ship', capacity: '2,770 sailors' }
    ]
  },
  {
    id: 'msc',
    name: 'MSC Cruises',
    code: 'MSC',
    color: '#0d9488',
    badgeGradient: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
    loyaltyProgram: 'MSC Voyagers Club',
    tiers: ['Classic', 'Silver', 'Gold', 'Black', 'Diamond'],
    ships: [
      { id: 'world_europa', name: 'MSC World Europa', class: 'World Class', capacity: '6,762 guests' },
      { id: 'seascape', name: 'MSC Seascape', class: 'Seaside EVO Class', capacity: '5,877 guests' }
    ]
  }
];

import { CRUISE_LINES as CORE_CRUISE_LINES } from './mockCruiseLines';

const line = (id, name, code, loyaltyProgram, tiers, ships) => ({
  id, name, code, color: '#2e7c83', badgeGradient: 'linear-gradient(135deg, #2e7c83, #0d3345)', loyaltyProgram, tiers, ships
});

const ships = (prefix, names, shipClass = 'Fleet') => names.map((name, index) => ({
  id: `${prefix}-${index + 1}`,
  name,
  class: shipClass,
  capacity: 'See cruise line'
}));

// The catalog is deliberately extensible: an unlisted line or vessel can be added
// from the sailing form without blocking a real booking from being saved.
export const CRUISE_LINES = [
  ...CORE_CRUISE_LINES,
  line('princess', 'Princess Cruises', 'PRINCESS', 'Captain’s Circle', ['Gold', 'Ruby', 'Platinum', 'Elite'], ships('princess', ['Sun Princess', 'Sky Princess', 'Regal Princess', 'Royal Princess', 'Discovery Princess', 'Enchanted Princess', 'Majestic Princess', 'Caribbean Princess', 'Crown Princess', 'Grand Princess', 'Island Princess', 'Coral Princess'], 'Royal Class')),
  line('holland-america', 'Holland America Line', 'HAL', 'Mariner Society', ['Star', 'Two Star', 'Three Star', 'Four Star', 'Five Star'], ships('hal', ['Rotterdam', 'Nieuw Statendam', 'Koningsdam', 'Eurodam', 'Nieuw Amsterdam', 'Westerdam', 'Oosterdam', 'Zuiderdam', 'Noordam', 'Zaandam', 'Volendam', 'P Rotterdam'], 'Pinnacle Class')),
  line('disney', 'Disney Cruise Line', 'DISNEY', 'Castaway Club', ['Silver', 'Gold', 'Platinum', 'Pearl'], ships('disney', ['Disney Wish', 'Disney Treasure', 'Disney Destiny', 'Disney Dream', 'Disney Fantasy', 'Disney Magic', 'Disney Wonder'], 'Disney Fleet')),
  line('costa', 'Costa Cruises', 'COSTA', 'Costa Club', ['Bronze', 'Silver', 'Gold', 'Platinum'], ships('costa', ['Costa Toscana', 'Costa Smeralda', 'Costa Firenze', 'Costa Favolosa', 'Costa Fascinosa', 'Costa Pacifica', 'Costa Serena', 'Costa Diadema', 'Costa Deliziosa', 'Costa Fortuna'], 'Costa Fleet')),
  line('cunard', 'Cunard', 'CUNARD', 'Cunard World Club', ['Silver', 'Gold', 'Platinum', 'Diamond'], ships('cunard', ['Queen Mary 2', 'Queen Anne', 'Queen Victoria', 'Queen Elizabeth'], 'Queen Class')),
  line('p-and-o', 'P&O Cruises', 'PANDO', 'Peninsular Club', ['Pacific', 'Atlantic', 'Mediterranean', 'Baltic'], ships('pando', ['Arvia', 'Iona', 'Britannia', 'Azura', 'Ventura', 'Aurora', 'Arcadia'], 'P&O Fleet')),
  line('regent', 'Regent Seven Seas Cruises', 'REGENT', 'Seven Seas Society', ['Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium', 'Commodore'], ships('regent', ['Seven Seas Grandeur', 'Seven Seas Splendor', 'Seven Seas Explorer', 'Seven Seas Voyager', 'Seven Seas Mariner', 'Seven Seas Navigator'], 'Luxury Fleet')),
  line('oceania', 'Oceania Cruises', 'OCEANIA', 'Oceania Club', ['Blue', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], ships('oceania', ['Allura', 'Vista', 'Aqua', 'Marina', 'Riviera', 'Sirena', 'Regatta', 'Nautica', 'Insignia'], 'Oceania Fleet')),
  line('silversea', 'Silversea', 'SILVERSEA', 'Venetian Society', ['Classic', 'Silver', 'Gold', 'Platinum', 'Diamond'], ships('silversea', ['Silver Ray', 'Silver Nova', 'Silver Moon', 'Silver Muse', 'Silver Dawn', 'Silver Spirit', 'Silver Whisper', 'Silver Cloud', 'Silver Wind', 'Silver Origin', 'Silver Endeavour'], 'Silver Fleet')),
  line('seabourn', 'Seabourn', 'SEABOURN', 'Seabourn Club', ['Member', 'Silver', 'Gold', 'Platinum', 'Diamond'], ships('seabourn', ['Seabourn Pursuit', 'Seabourn Venture', 'Seabourn Ovation', 'Seabourn Encore', 'Seabourn Quest', 'Seabourn Sojourn', 'Seabourn Odyssey'], 'Seabourn Fleet')),
  line('windstar', 'Windstar Cruises', 'WINDSTAR', 'Yacht Club', ['Star', 'One Star', 'Two Star', 'Three Star', 'Four Star'], ships('windstar', ['Star Breeze', 'Star Legend', 'Star Pride', 'Wind Surf', 'Wind Star', 'Wind Spirit'], 'Yacht Fleet')),
  line('azamara', 'Azamara', 'AZAMARA', 'Azamara Circle', ['Adventurer', 'Explorer', 'Discoverer', 'Leader'], ships('azamara', ['Azamara Journey', 'Azamara Quest', 'Azamara Pursuit', 'Azamara Onward'], 'Azamara Fleet')),
  line('viking', 'Viking', 'VIKING', 'Viking Explorer Society', ['Explorer', 'Platinum'], ships('viking', ['Viking Mars', 'Viking Neptune', 'Viking Saturn', 'Viking Sea', 'Viking Sky', 'Viking Star', 'Viking Orion', 'Viking Jupiter', 'Viking Venus', 'Viking Vela'], 'Viking Ocean')),
  line('marella', 'Marella Cruises', 'MARELLA', 'Marella Cruises Club', ['Silver', 'Gold', 'Platinum'], ships('marella', ['Marella Discovery', 'Marella Discovery 2', 'Marella Explorer', 'Marella Explorer 2', 'Marella Voyager'], 'Marella Fleet')),
  line('celestyal', 'Celestyal Cruises', 'CELESTYAL', 'Celestyal Captains Club', ['Blue', 'Silver', 'Gold'], ships('celestyal', ['Celestyal Journey', 'Celestyal Discovery', 'Celestyal Olympia'], 'Celestyal Fleet')),
  line('explora', 'Explora Journeys', 'EXPLORA', 'Explora Journeys Club', ['Journeyer', 'Discoverer', 'Navigator', 'Pioneer'], ships('explora', ['EXPLORA I', 'EXPLORA II', 'EXPLORA III', 'EXPLORA IV', 'EXPLORA V'], 'Explora Fleet')),
  line('ponant', 'PONANT', 'PONANT', 'PONANT Yacht Club', ['Club', 'Blue', 'Gold', 'Platinum'], ships('ponant', ['Le Commandant Charcot', 'Le Lyrial', 'Le Boréal', 'Le Soléal', 'Le Dumont-d’Urville', 'Le Lapérouse', 'Le Champlain', 'Le Bougainville', 'Le Jacques Cartier'], 'Small Yacht')),
  line('american', 'American Cruise Lines', 'ACL', 'American Cruise Lines Club', ['Explorer', 'Admiral', 'Commodore'], ships('acl', ['American Glory', 'American Legend', 'American Liberty', 'American Melody', 'American Symphony', 'American Serenade', 'American Heritage'], 'American River')),
  line('margaritaville', 'Margaritaville at Sea', 'MARGARITAVILLE', 'Fins Up Club', ['Island Hopper', 'Paradise Member', 'Paradise Plus'], ships('margaritaville', ['Margaritaville at Sea Paradise', 'Margaritaville at Sea Islander'], 'Paradise Class')),
  line('fred-olsen', 'Fred. Olsen Cruise Lines', 'FREDOLSEN', 'Olsen Cruise Club', ['Bronze', 'Silver', 'Gold'], ships('fredolsen', ['Bolette', 'Borealis', 'Balmoral', 'Braemar'], 'Fred Olsen Fleet')),
  line('saga', 'Saga Cruises', 'SAGA', 'Saga Club', ['Silver', 'Gold', 'Platinum'], ships('saga', ['Spirit of Discovery', 'Spirit of Adventure'], 'Spirit Class')),
  line('star-clippers', 'Star Clippers', 'STARCLIPPERS', 'Star Clippers Club', ['Clipper', 'Commodore', 'Captain'], ships('starclippers', ['Royal Clipper', 'Star Clipper', 'Star Flyer'], 'Tall Ship')),
  line('seadream', 'SeaDream Yacht Club', 'SEADREAM', 'SeaDream Club', ['Member', 'Silver', 'Gold'], ships('seadream', ['SeaDream I', 'SeaDream II'], 'Yacht'))
];

CRUISE_LINES.sort((a, b) => a.name.localeCompare(b.name));
CRUISE_LINES.forEach((cruiseLine) => cruiseLine.ships.sort((a, b) => a.name.localeCompare(b.name)));

export const findCruiseLine = (code) => CRUISE_LINES.find((item) => item.code === code) || CRUISE_LINES[0];
export const findShip = (lineCode, shipId, shipName) => {
  const cruiseLine = findCruiseLine(lineCode);
  return cruiseLine.ships.find((ship) => ship.id === shipId || ship.name === shipName) || {
    id: shipId || `custom-${String(shipName || 'ship').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: shipName || 'Custom vessel',
    class: 'Custom vessel',
    capacity: 'Not specified'
  };
};

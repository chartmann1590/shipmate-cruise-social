import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { SHIP_VENUES } from '../data/shipVenues';
import { CRUISE_LINES, findCruiseLine, findShip } from '../data/cruiseCatalog';
import { saveUserProfile } from '../services/firebase';

const CruiseContext = createContext(null);

const dateLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Dates not set';
  return `${new Date(`${startDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(`${endDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const sailingFromProfile = (profile) => {
  if (!profile?.currentShipName) return null;
  const catalogLine = findCruiseLine(profile.loyaltyLineCode || 'RCCL');
  return {
    id: profile.activeSailingId || `sailing-${profile.id}`,
    cruiseLineCode: profile.loyaltyLineCode || 'RCCL',
    cruiseLineName: profile.loyaltyLine === 'Independent cruiser' ? catalogLine.name : (profile.loyaltyLine || catalogLine.name),
    shipId: profile.currentShipId || 'wonder',
    shipName: profile.currentShipName,
    startDate: profile.cruiseStartDate || '2026-07-12',
    endDate: profile.cruiseEndDate || '2026-07-19',
    reservationCode: profile.reservationCode || '',
    status: 'upcoming'
  };
};

export const CruiseProvider = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [sailings, setSailings] = useState([]);
  const [activeSailingId, setActiveSailingId] = useState('');
  const [activeShip, setActiveShip] = useState({ id: 'unset', name: 'Choose a sailing', dates: 'No sailing selected', currentVoyage: 'Set up your first sailing', homePort: 'Ready when you are', ports: [] });
  const [itinerary, setItinerary] = useState([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [drinkCount, setDrinkCount] = useState(0);
  const [currentDeckLocation, setCurrentDeckLocation] = useState('Lido Deck Pool');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const persistProfileChanges = (changes) => {
    if (!currentUser) return;
    setCurrentUser((previous) => ({ ...previous, ...changes }));
    saveUserProfile(currentUser.id, changes).catch(() => {});
  };

  useEffect(() => {
    if (!currentUser?.id) {
      setSailings([]);
      setActiveSailingId('');
      setItinerary([]);
      setActiveShip({ id: 'unset', name: 'Choose a sailing', dates: 'No sailing selected', currentVoyage: 'Set up your first sailing', homePort: 'Ready when you are', ports: [] });
      return;
    }

    const profileSailings = currentUser.sailings?.length ? currentUser.sailings : [sailingFromProfile(currentUser)].filter(Boolean);
    const selectedId = currentUser.activeSailingId || profileSailings[0]?.id || '';
    setSailings(profileSailings);
    setActiveSailingId(selectedId);
    setDrinkCount(currentUser.drinkCount || 0);
    setCurrentDeckLocation(currentUser.location || 'Lido Deck Pool');
    setItinerary(currentUser.itinerary || []);

    if (!currentUser.sailings?.length && profileSailings.length) {
      persistProfileChanges({ sailings: profileSailings, activeSailingId: selectedId });
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const activeSailing = sailings.find((item) => item.id === activeSailingId);
    if (!activeSailing) return;
    const line = findCruiseLine(activeSailing.cruiseLineCode);
    const catalogShip = findShip(activeSailing.cruiseLineCode, activeSailing.shipId, activeSailing.shipName);
    setActiveShip({
      ...catalogShip,
      id: catalogShip.id,
      cruiseLine: activeSailing.cruiseLineName || line.name,
      cruiseLineCode: activeSailing.cruiseLineCode,
      currentVoyage: `${activeSailing.shipName} sailing`,
      dates: dateLabel(activeSailing.startDate, activeSailing.endDate),
      homePort: activeSailing.homePort || 'Port of departure',
      ports: activeSailing.ports || [],
      image: activeSailing.image || '/hero_banner.jpg'
    });
  }, [sailings, activeSailingId]);

  const updateSailings = (nextSailings, nextActiveId = activeSailingId) => {
    setSailings(nextSailings);
    setActiveSailingId(nextActiveId);
    persistProfileChanges({ sailings: nextSailings, activeSailingId: nextActiveId });
  };

  const linkReservation = (sailingData) => {
    const line = findCruiseLine(sailingData.cruiseLineCode);
    const ship = findShip(sailingData.cruiseLineCode, sailingData.shipId, sailingData.shipName);
    const sailing = {
      id: sailingData.id || `sailing-${Date.now()}`,
      cruiseLineCode: line.code,
      cruiseLineName: line.name,
      shipId: ship.id,
      shipName: ship.name,
      startDate: sailingData.startDate,
      endDate: sailingData.endDate,
      reservationCode: sailingData.reservationCode || '',
      homePort: sailingData.homePort || '',
      ports: sailingData.ports || [],
      status: sailingData.status || 'upcoming',
      updatedAt: new Date().toISOString()
    };
    const next = sailingData.id ? sailings.map((item) => item.id === sailing.id ? sailing : item) : [...sailings, sailing];
    updateSailings(next, sailing.id);
    persistProfileChanges({
      loyaltyLine: line.name,
      loyaltyLineCode: line.code,
      loyaltyTier: line.tiers[0] || 'Member',
      reservationCode: sailing.reservationCode,
      currentShipId: ship.id,
      currentShipName: ship.name,
      cruiseStartDate: sailing.startDate,
      cruiseEndDate: sailing.endDate,
      sailingId: sailing.id
    });
    setIsSyncModalOpen(false);
  };

  const setActiveSailing = (sailingId) => {
    const selected = sailings.find((item) => item.id === sailingId);
    if (!selected) return;
    setActiveSailingId(sailingId);
    persistProfileChanges({
      activeSailingId: sailingId,
      sailingId,
      currentShipId: selected.shipId,
      currentShipName: selected.shipName,
      cruiseStartDate: selected.startDate,
      cruiseEndDate: selected.endDate,
      loyaltyLine: selected.cruiseLineName,
      loyaltyLineCode: selected.cruiseLineCode,
      reservationCode: selected.reservationCode || ''
    });
  };

  const toggleOfflineMode = () => setIsOfflineMode((previous) => !previous);

  const updateDrinkCount = (delta) => {
    const newCount = Math.max(0, Math.min(currentUser?.drinkLimit || 15, drinkCount + delta));
    setDrinkCount(newCount);
    persistProfileChanges({ drinkCount: newCount });
  };

  const updateLocation = (newLocation) => {
    setCurrentDeckLocation(newLocation);
    persistProfileChanges({ location: newLocation });
  };

  const updateProfilePrivacy = (profileVisibility) => persistProfileChanges({ profileVisibility });

  const persistItinerary = (nextItinerary) => {
    setItinerary(nextItinerary);
    persistProfileChanges({ itinerary: nextItinerary });
  };

  const addItineraryEvent = (dayIndex, newEvent) => {
    const updated = [...itinerary];
    updated[dayIndex] = {
      ...updated[dayIndex],
      events: [...(updated[dayIndex].events || []), { ...newEvent, id: `event-${Date.now()}`, joined: 1, isMine: true }]
    };
    persistItinerary(updated);
  };

  const addItineraryDay = (dayData) => {
    const nextDayNumber = itinerary.length + 1;
    persistItinerary([...itinerary, { day: nextDayNumber, date: dayData.date || `Day ${nextDayNumber}`, title: dayData.title || 'New cruise day', port: dayData.port || 'At sea', type: dayData.type || 'sea', status: 'upcoming', weather: 'Weather will load for this location', events: [] }]);
  };

  const toggleJoinEvent = (dayIndex, eventId) => {
    const updated = [...itinerary];
    const day = updated[dayIndex];
    updated[dayIndex] = {
      ...day,
      events: (day.events || []).map((event) => event.id === eventId ? {
        ...event,
        isMine: !event.isMine,
        joined: event.isMine ? Math.max(1, event.joined - 1) : event.joined + 1
      } : event)
    };
    persistItinerary(updated);
  };

  return (
    <CruiseContext.Provider value={{
      activeShip,
      userProfile: currentUser,
      sailings,
      activeSailingId,
      setActiveSailing,
      itinerary,
      isOfflineMode,
      toggleOfflineMode,
      drinkCount,
      updateDrinkCount,
      currentDeckLocation,
      updateLocation,
      updateProfilePrivacy,
      isSyncModalOpen,
      setIsSyncModalOpen,
      linkReservation,
      addItineraryEvent,
      addItineraryDay,
      toggleJoinEvent,
      venues: SHIP_VENUES,
      cruiseLines: CRUISE_LINES
    }}>
      {children}
    </CruiseContext.Provider>
  );
};

export const useCruise = () => useContext(CruiseContext);

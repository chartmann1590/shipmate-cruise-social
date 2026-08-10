import React, { useState } from 'react';
import { useCruise } from '../../context/CruiseContext';
import { Calendar, Clock, MapPin, Plus, Users, Award, Compass, CheckCircle2 } from '../Icons';

export const ItineraryView = () => {
  const { itinerary, activeShip, addItineraryEvent, toggleJoinEvent } = useCruise();
  const [activeDayIndex, setActiveDayIndex] = useState(1); // Default to Today (CocoCay)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventCategory, setEventCategory] = useState('social');

  const currentDay = itinerary[activeDayIndex] || itinerary[0];

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addItineraryEvent(activeDayIndex, {
      title: eventTitle.trim(),
      time: eventTime,
      category: eventCategory
    });

    setEventTitle('');
    setIsAddEventOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderColor: 'rgba(56, 189, 248, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-gold">{activeShip.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{activeShip.dates}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Cruise Itinerary & Excursion Hub</h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
              Plan your port excursions, sea day activities, and connect with fellow sailors!
            </p>
          </div>

          <button
            onClick={() => setIsAddEventOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>Add Event / Excursion</span>
          </button>
        </div>
      </div>

      {/* Day Selector Horizontal Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {itinerary.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          const isToday = day.status === 'today';
          return (
            <button
              key={day.day}
              onClick={() => setActiveDayIndex(idx)}
              style={{
                flexShrink: 0,
                padding: '10px 16px',
                borderRadius: '14px',
                background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(3, 105, 161, 0.2) 100%)' : 'rgba(255, 255, 255, 0.04)',
                border: isToday ? '2px solid #fbbf24' : (isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-glass)'),
                color: isActive ? '#38bdf8' : '#94a3b8',
                textAlign: 'left',
                minWidth: '130px'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isToday ? '#fbbf24' : '#64748b', textTransform: 'uppercase' }}>
                Day {day.day} {isToday ? '• TODAY' : ''}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {day.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{day.date}</div>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      <div className={`glass-panel itinerary-day-card ${currentDay.status === 'today' ? 'today' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`badge ${currentDay.type === 'port' ? 'badge-teal' : 'badge-ocean'}`}>
                {currentDay.type.toUpperCase()} DAY
              </span>
              <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>{currentDay.weather}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginTop: '6px' }}>{currentDay.port}</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <Calendar size={14} />
            <span>{currentDay.date}</span>
          </div>
        </div>

        {/* Day Events Listing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentDay.events.map(ev => (
            <div key={ev.id} className="event-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={14} />
                  <span>{ev.time}</span>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{ev.title}</span>
                    {ev.category === 'formal' && (
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Formal Dress 🤵‍♀️🥂</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                    <span style={{ textTransform: 'capitalize' }}>Category: {ev.category}</span>
                    <span>•</span>
                    <span style={{ color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {ev.joined} Cruisers Joined
                    </span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => toggleJoinEvent(activeDayIndex, ev.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: ev.isMine ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: ev.isMine ? '#2dd4bf' : '#94a3b8',
                  border: ev.isMine ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid var(--border-glass)',
                  fontWeight: 600,
                  fontSize: '0.8rem'
                }}
              >
                {ev.isMine ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                <span>{ev.isMine ? 'Joined' : 'Join'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Event Modal */}
      {isAddEventOpen && (
        <div className="modal-overlay" onClick={() => setIsAddEventOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>Add Event to Day {currentDay.day} ({currentDay.title})</h3>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Event / Excursion Title</label>
                <input
                  type="text"
                  placeholder="e.g. Catamaran Snorkel Meetup or 80s Party"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Time</label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>Category</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff'
                  }}
                >
                  <option value="excursion">Shore Excursion</option>
                  <option value="social">Social Meetup</option>
                  <option value="dining">Dining & Drinks</option>
                  <option value="show">Onboard Show</option>
                  <option value="formal">Formal Night</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', color: '#94a3b8' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', background: '#0284c7', color: '#fff', fontWeight: 700 }}
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

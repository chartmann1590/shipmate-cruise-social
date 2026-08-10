import React from 'react';
import { Calendar, MessageSquare, Ship, Users, Waves } from '../Icons';

export const OnboardingView = ({ user, onSetSailing }) => (
  <section className="onboarding-shell">
    <div className="onboarding-orbit orbit-one" />
    <div className="onboarding-orbit orbit-two" />
    <div className="onboarding-copy">
      <span className="eyebrow">Welcome aboard, {user?.name?.split(' ')[0] || 'cruiser'}</span>
      <h1>Your sailing starts here.</h1>
      <p>Tell ShipMate which cruise you are taking so your feed, itinerary, groups, calls, and shipmate network all line up with the right deck and dates.</p>
      <button className="onboarding-primary" onClick={onSetSailing}><Ship size={17} /> Set my sailing</button>
    </div>
    <div className="onboarding-grid">
      <div><Waves size={18} /><strong>Live on your ship</strong><span>See the conversations that matter on this sailing.</span></div>
      <div><Calendar size={18} /><strong>Plan the days</strong><span>Keep future cruises and port plans in one place.</span></div>
      <div><MessageSquare size={18} /><strong>Meet your people</strong><span>Join groups, message, and call shipmates.</span></div>
      <div><Users size={18} /><strong>Stay in control</strong><span>Choose what is public and what stays private.</span></div>
    </div>
  </section>
);

import React from 'react';

export const LegalView = ({ kind }) => {
  const isPrivacy = kind === 'privacy';
  return <article className="legal-page glass-panel">
    <span className="eyebrow">ShipMate legal</span>
    <h1>{isPrivacy ? 'Privacy Policy' : 'Terms of Use'}</h1>
    <p className="legal-updated">Last updated: August 9, 2026</p>
    {isPrivacy ? <>
      <h2>What we collect</h2><p>ShipMate stores account details, sailing selections, messages, posts, reactions, comments, notification tokens, and privacy preferences needed to operate the service.</p>
      <h2>How we use it</h2><p>We use this information to provide sailing feeds, group conversations, calls, invitations, itinerary features, and notifications you enable.</p>
      <h2>Sharing and controls</h2><p>Private profile information is not presented in public discovery. You can change profile visibility, leave groups, disable notifications, and request account deletion from ShipMate support.</p>
      <h2>Safety</h2><p>Do not share cabin numbers, travel documents, payment details, or sensitive personal information in public posts or groups.</p>
    </> : <>
      <h2>Use of ShipMate</h2><p>ShipMate is a social planning tool for cruise travelers. You are responsible for your account, your content, and verifying all travel, safety, port, and onboard information with the cruise line.</p>
      <h2>Community rules</h2><p>No harassment, impersonation, illegal content, doxxing, spam, or unsafe behavior. Respect group privacy and only share invite links with people you intend to include.</p>
      <h2>Calls and notifications</h2><p>Voice/video calls use peer-to-peer browser technology and may expose network information to call participants. Notifications depend on browser, device, and operating-system permissions.</p>
      <h2>Availability</h2><p>ShipMate is provided as-is. We do not guarantee onboard connectivity, itinerary accuracy, or uninterrupted availability.</p>
    </>}
  </article>;
};

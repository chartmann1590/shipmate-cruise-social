import React from 'react';

const Icon = ({ path, size = 20, className = '', color = 'currentColor', strokeWidth = 2 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    {path}
  </svg>
);

export const Ship = (p) => <Icon {...p} path={<><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7"/><path d="M10 4h4"/><path d="M12 4v6"/><path d="M12 10 4 6"/><path d="m12 10 8-4"/></>} />;
export const Anchor = (p) => <Icon {...p} path={<><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M17 19.5a5 5 0 0 1-10 0"/></>} />;
export const Calendar = (p) => <Icon {...p} path={<><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />;
export const Clock = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />;
export const MapPin = (p) => <Icon {...p} path={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} />;
export const MessageSquare = (p) => <Icon {...p} path={<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>} />;
export const Newspaper = (p) => <Icon {...p} path={<><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></>} />;
export const Compass = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>} />;
export const Users = (p) => <Icon {...p} path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />;
export const Image = (p) => <Icon {...p} path={<><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>} />;
export const Send = (p) => <Icon {...p} path={<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>} />;
export const Plus = (p) => <Icon {...p} path={<><path d="M5 12h14"/><path d="M12 5v14"/></>} />;
export const Minus = (p) => <Icon {...p} path={<><path d="M5 12h14"/></>} />;
export const RefreshCw = (p) => <Icon {...p} path={<><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>} />;
export const Ticket = (p) => <Icon {...p} path={<><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z"/><line x1="13" y1="5" x2="13" y2="19"/></>} />;
export const Wifi = (p) => <Icon {...p} path={<><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/></>} />;
export const WifiOff = (p) => <Icon {...p} path={<><line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/><path d="M12 20h.01"/></>} />;
export const Award = (p) => <Icon {...p} path={<><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>} />;
export const Heart = (p) => <Icon {...p} path={<><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>} />;
export const GlassWater = (p) => <Icon {...p} path={<><path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.8 17.21a2 2 0 0 1-2 1.79Z"/><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0"/></>} />;
export const Waves = (p) => <Icon {...p} path={<><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></>} />;
export const Check = (p) => <Icon {...p} path={<><polyline points="20 6 9 17 4 12"/></>} />;
export const CheckCircle2 = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>} />;
export const X = (p) => <Icon {...p} path={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} />;
export const Copy = (p) => <Icon {...p} path={<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>} />;
export const Download = (p) => <Icon {...p} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />;
export const Sparkles = (p) => <Icon {...p} path={<><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></>} />;
export const Wine = (p) => <Icon {...p} path={<><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a7 7 0 0 0 7-7c0-2-1-4-3-5H8C6 4 5 6 5 8a7 7 0 0 0 7 7Z"/></>} />;
export const Share2 = (p) => <Icon {...p} path={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>} />;
export const QrCode = (p) => <Icon {...p} path={<><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1a2 2 0 0 1 2 2v1"/></>} />;
export const User = (p) => <Icon {...p} path={<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>} />;
export const LogIn = (p) => <Icon {...p} path={<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></>} />;
export const LogOut = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>} />;
export const UserPlus = (p) => <Icon {...p} path={<><circle cx="9" cy="8" r="4"/><path d="M3 21a6 6 0 0 1 12 0"/><path d="M19 8v6"/><path d="M16 11h6"/></>} />;
export const Mail = (p) => <Icon {...p} path={<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></>} />;
export const Lock = (p) => <Icon {...p} path={<><rect width="16" height="12" x="4" y="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>} />;

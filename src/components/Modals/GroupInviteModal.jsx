import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, X } from '../Icons';

export const GroupInviteModal = ({ group, onClose }) => {
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${window.location.origin}/?tab=chats&join=${encodeURIComponent(group.inviteCode)}`;

  useEffect(() => {
    QRCode.toDataURL(inviteUrl, { width: 240, margin: 2, color: { dark: '#0d3345', light: '#fffdf8' } }).then(setQrCode).catch(() => {});
  }, [inviteUrl]);

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card group-invite-modal" onClick={(event) => event.stopPropagation()}>
      <div className="modal-heading-row"><div><span className="eyebrow">Invite shipmates</span><h3>{group.name}</h3></div><button onClick={onClose} aria-label="Close invite"><X size={18} /></button></div>
      <p className="modal-copy">Share this link or QR code. People can join the sailing group even if they do not have an account yet.</p>
      {qrCode && <img className="invite-qr" src={qrCode} alt={`QR code to join ${group.name}`} />}
      <div className="invite-url">{inviteUrl}</div>
      <button className="invite-copy-button" onClick={copyInvite}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Invite copied' : 'Copy invite link'}</button>
    </div>
  </div>;
};

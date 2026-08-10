import React, { useState } from 'react';
import { X } from '../Icons';

export const JoinGroupModal = ({ initialCode = '', onJoin, onClose }) => {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try { await onJoin(code); onClose(); } catch (err) { setError(err.message); }
  };
  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
      <div className="modal-heading-row"><div><span className="eyebrow">Join a sailing group</span><h3>Enter an invite code</h3></div><button onClick={onClose} aria-label="Close join"><X size={18} /></button></div>
      <p className="modal-copy">Paste the invite code from a shipmate or open a shared invite link.</p>
      <form onSubmit={submit} className="join-group-form"><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="SAIL-ABC123" required /><button type="submit">Join group</button></form>
      {error && <div className="form-error" role="alert">{error}</div>}
    </div>
  </div>;
};

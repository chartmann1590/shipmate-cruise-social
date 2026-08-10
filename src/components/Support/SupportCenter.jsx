import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createSupportTicket, subscribeToSupportTickets } from '../../services/firebase';

export const SupportCenter = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => subscribeToSupportTickets(currentUser?.id, setTickets, () => {}), [currentUser?.id]);

  const submit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !currentUser) return;
    setStatus('Submitting to the ShipMate support queue...');
    await createSupportTicket({ createdBy: currentUser.id, reporterName: currentUser.name, reporterEmail: currentUser.email, title: title.trim(), description: description.trim(), appUrl: window.location.href });
    setTitle('');
    setDescription('');
    setStatus('Submitted. A GitHub issue will be created and linked here shortly.');
  };

  return <section className="support-center glass-panel">
    <div className="support-heading"><div><span className="eyebrow">Support desk</span><h3>Report a problem</h3><p>Tell us what went wrong. Your report becomes a trackable GitHub issue.</p></div></div>
    <form onSubmit={submit} className="support-form">
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Short summary" required />
      <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What happened? Include the sailing, screen, and steps to reproduce." rows="4" required />
      <button type="submit">Send to support</button>
    </form>
    {status && <p className="support-status" role="status">{status}</p>}
    <div className="support-issues"><strong>Your reports</strong>{tickets.length ? tickets.map((ticket) => <div className="support-issue" key={ticket.id}><span><b>{ticket.title}</b><small>{ticket.status || 'open'}</small></span>{ticket.issueUrl ? <a href={ticket.issueUrl} target="_blank" rel="noreferrer">View issue</a> : <small>Pending GitHub issue</small>}</div>) : <p>No reports yet.</p>}</div>
  </section>;
};

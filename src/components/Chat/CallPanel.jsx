import React, { useEffect, useRef, useState } from 'react';
import { addCallCandidate, subscribeToCall, updateCall, updateGroupPreview } from '../../services/firebase';

export const CallPanel = ({ group, user }) => {
  const [call, setCall] = useState(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peer = useRef(null);
  const stream = useRef(null);
  const addedCandidates = useRef(new Set());

  useEffect(() => {
    if (!group?.currentCallId) {
      setCall(null);
      setJoined(false);
      return () => {};
    }
    return subscribeToCall(group.id, group.currentCallId, setCall, (snapshotError) => setError(snapshotError.message));
  }, [group?.id, group?.currentCallId]);

  useEffect(() => {
    if (call?.callerId === user.id) setJoined(true);
  }, [call?.id, call?.callerId, user.id]);

  useEffect(() => {
    if (!call || !joined || peer.current) return () => {};
    let cancelled = false;
    const connect = async () => {
      try {
        const isCaller = call.callerId === user.id;
        const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: call.type === 'video' });
        if (cancelled) return;
        stream.current = media;
        if (localVideo.current) localVideo.current.srcObject = media;
        const connection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        peer.current = connection;
        media.getTracks().forEach((track) => connection.addTrack(track, media));
        connection.ontrack = (event) => { if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0]; };
        connection.onicecandidate = (event) => {
          if (event.candidate) addCallCandidate(group.id, call.id, isCaller ? 'callerCandidates' : 'calleeCandidates', event.candidate.toJSON()).catch(() => {});
        };
        if (isCaller && !call.offer) {
          const offer = await connection.createOffer();
          await connection.setLocalDescription(offer);
          await updateCall(group.id, call.id, { offer: { type: offer.type, sdp: offer.sdp }, callerReady: true });
        } else if (!isCaller && call.offer && !call.answer) {
          await connection.setRemoteDescription(call.offer);
          const answer = await connection.createAnswer();
          await connection.setLocalDescription(answer);
          await updateCall(group.id, call.id, { answer: { type: answer.type, sdp: answer.sdp } });
        }
      } catch (connectionError) {
        setError(connectionError.message || 'Camera or microphone access was denied.');
      }
    };
    connect();
    return () => { cancelled = true; };
  }, [call?.id, joined, user.id]);

  useEffect(() => {
    const connection = peer.current;
    if (!connection || !call || !joined) return;
    const isCaller = call.callerId === user.id;
    if (!isCaller && call.offer && !connection.currentRemoteDescription) connection.setRemoteDescription(call.offer).catch(() => {});
    if (isCaller && call.answer && !connection.currentRemoteDescription) connection.setRemoteDescription(call.answer).catch(() => {});
    const candidates = isCaller ? call.calleeCandidates : call.callerCandidates;
    (candidates || []).forEach((candidate) => {
      const key = JSON.stringify(candidate);
      if (!addedCandidates.current.has(key)) {
        addedCandidates.current.add(key);
        connection.addIceCandidate(candidate).catch(() => {});
      }
    });
  }, [call, joined, user.id]);

  const joinCall = () => { setError(''); setJoined(true); };
  const leaveCall = async () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    peer.current?.close();
    peer.current = null;
    if (call) await updateCall(group.id, call.id, { status: 'ended' }).catch(() => {});
    await updateGroupPreview(group.id, { currentCallId: null, currentCallType: null }).catch(() => {});
    setJoined(false);
  };

  if (!call) return null;
  const isCaller = call.callerId === user.id;
  return <div className="call-panel">
    <div className="call-panel-heading"><div><span className="eyebrow">{call.type === 'video' ? 'Video call' : 'Voice call'}</span><strong>{isCaller ? 'Calling your group' : `${call.callerName} is calling`}</strong></div>{!isCaller && !joined && <button onClick={joinCall}>Join call</button>}</div>
    {joined && <div className="call-stage"><video ref={remoteVideo} autoPlay playsInline className="call-remote-video" /><video ref={localVideo} autoPlay muted playsInline className="call-local-video" /></div>}
    {error && <div className="form-error" role="alert">{error}</div>}
    {joined && <button className="call-end-button" onClick={leaveCall}>End call</button>}
  </div>;
};

import React, { useRef, useState } from 'react';

const blobToDataUrl = (blob) => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });

export const VoiceNoteRecorder = ({ onSend }) => {
  const recorder = useRef(null);
  const chunks = useRef([]);
  const startedAt = useRef(0);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 24000 });
      chunks.current = [];
      startedAt.current = Date.now();
      recorder.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => event.data.size && chunks.current.push(event.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks.current, { type: mediaRecorder.mimeType });
        if (blob.size > 850000) { setError('That voice note is too large. Keep recordings under 30 seconds.'); return; }
        await onSend(await blobToDataUrl(blob), mediaRecorder.mimeType, Math.round((Date.now() - startedAt.current) / 1000));
      };
      mediaRecorder.start();
      setRecording(true);
      window.setTimeout(() => { if (mediaRecorder.state === 'recording') mediaRecorder.stop(); setRecording(false); }, 30000);
    } catch (captureError) { setError(captureError.message || 'Microphone access was denied.'); }
  };

  const stop = () => { if (recorder.current?.state === 'recording') recorder.current.stop(); setRecording(false); };

  return <div className="voice-note-recorder">{recording ? <button type="button" className="voice-recording-button" onClick={stop}>Stop recording <span>●</span></button> : <button type="button" className="voice-record-button" onClick={start} aria-label="Record voice note">Hold to record voice note</button>}{error && <span className="voice-note-error">{error}</span>}</div>;
};

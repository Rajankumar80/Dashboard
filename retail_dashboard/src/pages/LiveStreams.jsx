import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Video, AlertTriangle, Wifi } from 'lucide-react';
import Hls from 'hls.js';
import './LiveStreams.css';
const API_BASE = import.meta.env.VITE_API_URL;

export default function LiveStreams() {
  const [stores, setStores] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [isWebRTC, setIsWebRTC] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.is_admin === true);
      if (payload.is_admin) {
        fetch(`${API_BASE}/api/stores`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(setStores);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let url = `${API_BASE}/api/live/cameras`;

    if (isAdmin && selectedStore) {
      url += `?store_name=${encodeURIComponent(selectedStore)}`;
    }
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCameras(data);
        if (data.length > 0 && !selectedCamera) {
          setSelectedCamera(data[0].id);
        }
      });
  }, [selectedStore, isAdmin]);

  useEffect(() => {
    if (!selectedCamera) return;
    const cam = cameras.find(c => c.id === parseInt(selectedCamera));
    if (cam) {
      const webrtcUrl = cam.webrtc_url?.trim();
      const primaryUrl = webrtcUrl || cam.url;

      setStreamUrl(primaryUrl || '');
      setIsWebRTC(!!webrtcUrl);
      setError('');
    }
  }, [selectedCamera, cameras]);

  const loadStream = () => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsLoading(true);
    setIsPlaying(false);
    setError('');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = streamUrl.endsWith('.m3u8') || streamUrl.includes('/live') || streamUrl.includes('hls');

    if (isWebRTC) {
      setError('WebRTC streams require special handling. Native support coming soon.');
      setIsLoading(false);
    } else if (streamUrl.startsWith('rtsp://')) {
      setError('RTSP streams are not supported directly in browsers. Please use WebRTC URL or HLS.');
      setIsLoading(false);
    } else if (isHls) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          enableWorker: true,
          maxBufferLength: 30
        });
        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => setIsLoading(false));
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setError('Failed to load HLS stream');
          setIsLoading(false);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        setIsLoading(false);
      } else {
        setError('HLS not supported in this browser');
        setIsLoading(false);
      }
    } else {
      video.src = streamUrl;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStream();
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError('Cannot play this stream');

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => setError('Playback failed'));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else videoRef.current.requestFullscreen();
    }
  };

  const handleRetry = () => {
    setError('');
    loadStream();
  };

  return (
    <div className="live-streams">
      <div className="live-header">
        <div className="live-title">
          <Video size={28} />
          <h1>Live Streams</h1>
        </div>
        <div className="live-status">
          <span className="live-dot"></span>
          LIVE
        </div>
      </div>

      <div className="live-controls">
        {isAdmin && (
          <div className="select-group">
            <label>Store</label>
            <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
              <option value="">Select Store</option>
              {stores.map(s => (
                <option key={s.store_name} value={s.store_name}>{s.store_name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="select-group">
          <label>Camera</label>
          <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)}>
            <option value="">Select Camera</option>
            {cameras.map(cam => (
              <option key={cam.id} value={cam.id}>
                {cam.name} 
                {cam.webrtc_url ? ' (WebRTC)' : cam.url?.startsWith('rtsp://') ? ' (RTSP - Not Supported)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="video-main">
        <div className="video-wrapper">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Connecting to stream...</p>
            </div>
          )}

          {error && (
            <div className="error-overlay">
              <AlertTriangle size={32} color="#f87171" />
              <p>{error}</p>
              <button onClick={handleRetry}>Retry</button>
            </div>
          )}

          <video
            ref={videoRef}
            className="live-video"
            playsInline
            muted={isMuted}
          />

          <div className="video-controls">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button className="control-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
            <button className="control-btn" onClick={toggleFullscreen}>
              <Maximize size={22} />
            </button>
            <div className="stream-info">
              <span className="camera-name">
                {cameras.find(c => c.id === parseInt(selectedCamera))?.name || 'No Camera Selected'}
                {isWebRTC && <span className="webrtc-badge"></span>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
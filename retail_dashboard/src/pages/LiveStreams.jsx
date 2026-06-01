// import React, { useState, useEffect, useRef } from 'react';
// import { Play, Pause, Volume2, VolumeX, Maximize, Video, AlertTriangle } from 'lucide-react';
// import Hls from 'hls.js';
// import './LiveStreams.css';

// const API_BASE = import.meta.env.VITE_API_URL;

// // Always ensure the WHEP endpoint ends with /whep (MediaMTX convention)
// const buildWhepUrl = (url) => {
//   const trimmed = url.replace(/\/$/, '');
//   return /\/whep$/i.test(trimmed) ? trimmed : trimmed + '/whep';
// };

// export default function LiveStreams() {
//   const [stores, setStores]               = useState([]);
//   const [cameras, setCameras]             = useState([]);
//   const [selectedStore, setSelectedStore] = useState('');
//   const [selectedCamera, setSelectedCamera] = useState('');
//   const [streamUrl, setStreamUrl]         = useState('');
//   const [isWebRTC, setIsWebRTC]           = useState(false);
//   const [isPlaying, setIsPlaying]         = useState(false);
//   const [isMuted, setIsMuted]             = useState(true);   // muted=true allows autoplay
//   const [isLoading, setIsLoading]         = useState(false);
//   const [error, setError]                 = useState('');
//   const [isAdmin, setIsAdmin]             = useState(false);

//   const videoRef = useRef(null);
//   const hlsRef   = useRef(null);
//   const peerRef  = useRef(null);

//   const getToken = () => localStorage.getItem('token');

//   // ── fetch stores (admin only) ──────────────────────────────────────────────
//   useEffect(() => {
//     const token = getToken();
//     if (!token) return;
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       setIsAdmin(payload.is_admin === true);
//       if (payload.is_admin) {
//         fetch(`${API_BASE}/api/stores`, {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//           .then(r => r.json())
//           .then(setStores)
//           .catch(() => {});
//       }
//     } catch (_) {}
//   }, []);

//   // ── fetch cameras whenever store changes ───────────────────────────────────
//   useEffect(() => {
//     const token = getToken();
//     if (!token) return;
//     let url = `${API_BASE}/api/live/cameras`;
//     if (isAdmin && selectedStore) url += `?store_name=${encodeURIComponent(selectedStore)}`;

//     fetch(url, { headers: { Authorization: `Bearer ${token}` } })
//       .then(r => r.json())
//       .then(data => {
//         setCameras(data);
//         if (data.length > 0 && !selectedCamera) setSelectedCamera(data[0].id);
//       })
//       .catch(() => {});
//   }, [selectedStore, isAdmin]);

//   // ── resolve stream URL when camera selection changes ──────────────────────
//   useEffect(() => {
//     if (!selectedCamera) return;
//     const cam = cameras.find(c => c.id === parseInt(selectedCamera));
//     if (!cam) return;
//     const webrtcUrl = cam.webrtc_url?.trim();
//     setStreamUrl(webrtcUrl || cam.url || '');
//     setIsWebRTC(!!webrtcUrl);
//     setError('');
//   }, [selectedCamera, cameras]);

//   // ── cleanup helpers ────────────────────────────────────────────────────────
//   const destroyHls = () => {
//     if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
//   };
//   const destroyPeer = () => {
//     if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
//   };

//   // ── WebRTC / WHEP negotiation (MediaMTX) ──────────────────────────────────
//   const startWebRTC = async () => {
//     const video = videoRef.current;
//     if (!video || !streamUrl) return;

//     setIsLoading(true);
//     setIsPlaying(false);
//     setError('');
//     destroyHls();
//     destroyPeer();
//     video.srcObject = null;

//     // Mixed-content guard
//     if (window.location.protocol === 'https:' && streamUrl.startsWith('http://')) {
//       setError(
//         'Mixed content blocked: your app is on HTTPS but the stream is HTTP. ' +
//         'Either serve the stream over HTTPS or open the app over HTTP.'
//       );
//       setIsLoading(false);
//       return;
//     }

//     const whepUrl = buildWhepUrl(streamUrl);

//     const attempt = async (url) => {
//       const pc = new RTCPeerConnection({
//         iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//       });
//       peerRef.current = pc;

//       pc.addTransceiver('video', { direction: 'recvonly' });
//       pc.addTransceiver('audio', { direction: 'recvonly' });

//       pc.ontrack = ({ streams }) => {
//         if (streams?.[0] && video) {
//           video.srcObject = streams[0];
//           setIsLoading(false);
//           video.play().catch(() => {});
//           setIsPlaying(true);
//         }
//       };

//       pc.oniceconnectionstatechange = () => {
//         if (pc.iceConnectionState === 'failed') {
//           setError('WebRTC ICE failed — check network/firewall.');
//           setIsLoading(false);
//         }
//       };

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       const res = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/sdp' },
//         body: offer.sdp
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);

//       const sdp = await res.text();
//       await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
//     };

//     try {
//       await attempt(whepUrl);
//     } catch (err) {
//       destroyPeer();
//       // fallback: try the raw URL in case it already had /whep
//       if (whepUrl !== streamUrl.replace(/\/$/, '')) {
//         try {
//           await attempt(streamUrl.replace(/\/$/, ''));
//         } catch (err2) {
//           setError(`Could not connect. Tried:\n• ${whepUrl}\n• ${streamUrl} (${err2.message})`);
//           setIsLoading(false);
//         }
//       } else {
//         setError(`Could not connect to ${whepUrl}: ${err.message}`);
//         setIsLoading(false);
//       }
//     }
//   };

//   // ── HLS loader ────────────────────────────────────────────────────────────
//   const startHls = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (Hls.isSupported()) {
//       const hls = new Hls({ lowLatencyMode: true, enableWorker: true, maxBufferLength: 30 });
//       hlsRef.current = hls;
//       hls.loadSource(streamUrl);
//       hls.attachMedia(video);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         setIsLoading(false);
//         video.play().catch(() => {});
//       });
//       hls.on(Hls.Events.ERROR, (_, data) => {
//         if (data.fatal) { setError('Failed to load HLS stream'); setIsLoading(false); }
//       });
//     } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
//       video.src = streamUrl;
//       setIsLoading(false);
//     } else {
//       setError('HLS is not supported in this browser.');
//       setIsLoading(false);
//     }
//   };

//   // ── main load dispatcher ───────────────────────────────────────────────────
//   const loadStream = () => {
//     const video = videoRef.current;
//     if (!video || !streamUrl) return;

//     setIsLoading(true);
//     setIsPlaying(false);
//     setError('');
//     destroyHls();
//     destroyPeer();
//     video.srcObject = null;
//     video.removeAttribute('src');

//     if (isWebRTC) {
//       startWebRTC();
//       return;
//     }

//     if (streamUrl.startsWith('rtsp://')) {
//       setError('RTSP cannot be played in browsers. Configure a WebRTC URL for this camera.');
//       setIsLoading(false);
//       return;
//     }

//     const isHls = streamUrl.endsWith('.m3u8') || streamUrl.includes('hls');
//     if (isHls) {
//       startHls();
//     } else {
//       video.src = streamUrl;
//       setIsLoading(false);
//     }
//   };

//   // ── re-load whenever streamUrl changes ────────────────────────────────────
//   useEffect(() => {
//     loadStream();

//     const video = videoRef.current;
//     if (!video) return;
//     const onPlay  = () => setIsPlaying(true);
//     const onPause = () => setIsPlaying(false);
//     video.addEventListener('play',  onPlay);
//     video.addEventListener('pause', onPause);

//     return () => {
//       video.removeEventListener('play',  onPlay);
//       video.removeEventListener('pause', onPause);
//       destroyHls();
//       destroyPeer();
//     };
//   }, [streamUrl]);

//   // ── controls ──────────────────────────────────────────────────────────────
//   const togglePlay = () => {
//     if (!videoRef.current) return;
//     if (isPlaying) videoRef.current.pause();
//     else videoRef.current.play().catch(() => setError('Playback failed'));
//   };

//   const toggleMute = () => {
//     if (!videoRef.current) return;
//     videoRef.current.muted = !isMuted;
//     setIsMuted(m => !m);
//   };

//   const toggleFullscreen = () => {
//     if (!videoRef.current) return;
//     if (document.fullscreenElement) document.exitFullscreen();
//     else videoRef.current.requestFullscreen();
//   };

//   const currentCam = cameras.find(c => c.id === parseInt(selectedCamera));

//   return (
//     <div className="live-streams">
//       <div className="live-header">
//         <div className="live-title">
//           <Video size={28} />
//           <h1>Live Streams</h1>
//         </div>
//         <div className="live-status">
//           <span className="live-dot" />
//           LIVE
//         </div>
//       </div>

//       <div className="live-controls">
//         {isAdmin && (
//           <div className="select-group">
//             <label>Store</label>
//             <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
//               <option value="">Select Store</option>
//               {stores.map(s => (
//                 <option key={s.store_name} value={s.store_name}>{s.store_name}</option>
//               ))}
//             </select>
//           </div>
//         )}
//         <div className="select-group">
//           <label>Camera</label>
//           <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)}>
//             <option value="">Select Camera</option>
//             {cameras.map(cam => (
//               <option key={cam.id} value={cam.id}>
//                 {cam.name}
//                 {cam.webrtc_url
//                   ? ' (WebRTC)'
//                   : cam.url?.startsWith('rtsp://')
//                   ? ' (RTSP – Not Supported)'
//                   : ''}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="video-main">
//         <div className="video-wrapper">
//           {isLoading && (
//             <div className="loading-overlay">
//               <div className="loading-spinner" />
//               <p>Connecting to stream…</p>
//             </div>
//           )}

//           {error && !isLoading && (
//             <div className="error-overlay">
//               <AlertTriangle size={32} color="#f87171" />
//               <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
//               <button onClick={() => { setError(''); loadStream(); }}>Retry</button>
//             </div>
//           )}

//           <video
//             ref={videoRef}
//             className="live-video"
//             playsInline
//             autoPlay
//             muted={isMuted}
//           />

//           <div className="video-controls">
//             <button className="control-btn" onClick={togglePlay}>
//               {isPlaying ? <Pause size={22} /> : <Play size={22} />}
//             </button>
//             <button className="control-btn" onClick={toggleMute}>
//               {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
//             </button>
//             <button className="control-btn" onClick={toggleFullscreen}>
//               <Maximize size={22} />
//             </button>
//             <div className="stream-info">
//               <span className="camera-name">
//                 {currentCam?.name || 'No Camera Selected'}
//                 {isWebRTC && <span className="webrtc-badge" />}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertTriangle } from 'lucide-react';
import Hls from 'hls.js';
import './LiveStreams.css';

const API_BASE = import.meta.env.VITE_API_URL;

const buildWhepUrl = (url) => {
  const trimmed = url.replace(/\/$/, '');
  return /\/whep$/i.test(trimmed) ? trimmed : trimmed + '/whep';
};

export default function LiveStreams() {
  const [stores, setStores]               = useState([]);
  const [cameras, setCameras]             = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [streamUrl, setStreamUrl]         = useState('');
  const [isWebRTC, setIsWebRTC]           = useState(false);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [isMuted, setIsMuted]             = useState(true);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState('');
  const [isAdmin, setIsAdmin]             = useState(false);

  const videoRef = useRef(null);
  const hlsRef   = useRef(null);
  const peerRef  = useRef(null);

  const getToken = () => localStorage.getItem('token');

  // fetch stores (admin only)
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
          .then(r => r.json())
          .then(setStores)
          .catch(() => {});
      }
    } catch (_) {}
  }, []);

  // fetch cameras — reset selected camera whenever store changes
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    let url = `${API_BASE}/api/live/cameras`;
    if (isAdmin && selectedStore) url += `?store_name=${encodeURIComponent(selectedStore)}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setCameras(data);
        // always reset to first camera of the new store
        setSelectedCamera(data.length > 0 ? data[0].id : '');
      })
      .catch(() => {});
  }, [selectedStore, isAdmin]);

  // resolve stream URL when camera selection changes
  useEffect(() => {
    if (!selectedCamera) {
      setStreamUrl('');
      setError('');
      return;
    }
    const cam = cameras.find(c => c.id === parseInt(selectedCamera));
    if (!cam) return;
    const webrtcUrl = cam.webrtc_url?.trim();
    setStreamUrl(webrtcUrl || cam.url || '');
    setIsWebRTC(!!webrtcUrl);
    setError('');
  }, [selectedCamera, cameras]);

  // cleanup helpers
  const destroyHls = () => {
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
  };
  const destroyPeer = () => {
    if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
  };

  // WebRTC / WHEP negotiation
  const startWebRTC = async () => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsLoading(true);
    setIsPlaying(false);
    setError('');
    destroyHls();
    destroyPeer();
    video.srcObject = null;

    if (window.location.protocol === 'https:' && streamUrl.startsWith('http://')) {
      setError(
        'Mixed content blocked: your app is on HTTPS but the stream is HTTP.\n' +
        'Open the app over HTTP or serve the stream over HTTPS.'
      );
      setIsLoading(false);
      return;
    }

    const whepUrl = buildWhepUrl(streamUrl);

    const attempt = async (url) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerRef.current = pc;

      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      pc.ontrack = ({ streams }) => {
        if (streams?.[0] && video) {
          video.srcObject = streams[0];
          setIsLoading(false);
          video.play().catch(() => {});
          setIsPlaying(true);
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          setError('WebRTC ICE failed — check network/firewall.');
          setIsLoading(false);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: offer.sdp
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const sdp = await res.text();
      await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
    };

    try {
      await attempt(whepUrl);
    } catch (err) {
      destroyPeer();
      if (whepUrl !== streamUrl.replace(/\/$/, '')) {
        try {
          await attempt(streamUrl.replace(/\/$/, ''));
        } catch (err2) {
          setError(`Could not connect.\n• ${whepUrl}\n• ${streamUrl} (${err2.message})`);
          setIsLoading(false);
        }
      } else {
        setError(`Could not connect to ${whepUrl}: ${err.message}`);
        setIsLoading(false);
      }
    }
  };

  // HLS loader
  const startHls = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true, enableWorker: true, maxBufferLength: 30 });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) { setError('Failed to load HLS stream'); setIsLoading(false); }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      setIsLoading(false);
    } else {
      setError('HLS is not supported in this browser.');
      setIsLoading(false);
    }
  };

  // main load dispatcher
  const loadStream = () => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsLoading(true);
    setIsPlaying(false);
    setError('');
    destroyHls();
    destroyPeer();
    video.srcObject = null;
    video.removeAttribute('src');

    if (isWebRTC) {
      startWebRTC();
      return;
    }

    if (streamUrl.startsWith('rtsp://')) {
      setError('RTSP cannot be played in browsers. Configure a WebRTC URL for this camera.');
      setIsLoading(false);
      return;
    }

    const isHls = streamUrl.endsWith('.m3u8') || streamUrl.includes('hls');
    if (isHls) {
      startHls();
    } else {
      video.src = streamUrl;
      setIsLoading(false);
    }
  };

  // reload whenever streamUrl changes
  useEffect(() => {
    if (!streamUrl) return;
    loadStream();

    const video = videoRef.current;
    if (!video) return;
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener('play',  onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play',  onPlay);
      video.removeEventListener('pause', onPause);
      destroyHls();
      destroyPeer();
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => setError('Playback failed'));
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(m => !m);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else videoRef.current.requestFullscreen();
  };

  const currentCam = cameras.find(c => c.id === parseInt(selectedCamera));

  return (
    <div className="live-streams">

      <div className="live-controls">
        {isAdmin && (
          <div className="select-group">
            <label>Store</label>
            <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
              <option value="">Select Store</option>
              {stores.map(s => (
                <option key={s.store_name} value={s.store_name}>{s.store_name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="select-group">
          <label>Camera</label>
          <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)}>
            <option value="">Select Camera</option>
            {cameras.map(cam => (
              <option key={cam.id} value={cam.id}>
                {cam.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="video-main">
        <div className="video-wrapper">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <p>Connecting to stream…</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="error-overlay">
              <AlertTriangle size={32} color="#f87171" />
              <p>{error}</p>
              <button onClick={() => { setError(''); loadStream(); }}>Retry</button>
            </div>
          )}

          <video
            ref={videoRef}
            className="live-video"
            playsInline
            autoPlay
            muted={isMuted}
          />

          <div className="video-controls">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className="control-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button className="control-btn" onClick={toggleFullscreen}>
              <Maximize size={20} />
            </button>
            <div className="stream-info">
              <span className="camera-name">
                {currentCam?.name || ''}
                {isWebRTC && <span className="webrtc-badge" />}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import './VideoPlayer.scss';
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ video, handleClose }) {
  const [minimized, setMinimized] = useState(false);
  const playerRef = useRef();

  useEffect(() => {
    const player = videojs(playerRef.current, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: 'auto',
    }, () => {
      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src(video.url);
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.url);
        hls.attachMedia(player);
      }
    });

    return () => {
      player.dispose();
    };
  }, []);

  const minimize = (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName !== 'VIDEO') {
      setMinimized(true);
    }
  };

  return (
    <div className={`videoPlayerContainer ${minimized ? 'minimized' : ''}`} onClick={minimize}>
      <video ref={playerRef} className="video-js vjs-medieteknik" />
    </div>
  );
}

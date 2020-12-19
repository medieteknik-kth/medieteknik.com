import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import './VideoPlayer.scss';
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ videoUrl }) {
  const playerRef = useRef();

  console.log(videoUrl);

  useEffect(() => {
    const player = videojs(playerRef.current, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: 'auto',
    }, () => {
      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src(videoUrl);
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(player);
      }
    });

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <video ref={playerRef} className="video-js vjs-medieteknik" style={{width: '300px', height: '300px'}} />
  );
}

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import './VideoPlayer.scss';
import 'video.js/dist/video-js.css';

export default function VideoPlayer({ videoUrl, extraStyle }) {
    const [player, setPlayer] = useState(null);

    const playerRef = useRef(null);

    useEffect(() => {
        const playerTemp = videojs(playerRef.current, {
            controls: true,
            autoplay: true,
            muted: true,
            preload: 'auto',
            fluid: true,
            controlBar: {
                pictureInPictureToggle: false,
            },
            fill: true,
            muted: false
        }, () => {
            if (playerTemp.canPlayType('application/vnd.apple.mpegurl')) {
                playerTemp.src(videoUrl);
            } else if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoUrl);
                hls.attachMedia(playerTemp);
            }
        });

        setPlayer(playerTemp);

        return () => {
            playerTemp.dispose();
        };
    }, []);

    useEffect(() => {
        if (player !== null && player !== undefined) {
            if (player.canPlayType('application/vnd.apple.mpegurl')) {
                player.src(videoUrl);
            } else if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoUrl);
                hls.attachMedia(player);
            }
        }
    }, [videoUrl]);

  return (
      <div style={extraStyle}>
        <video
            ref={playerRef} 
            className="video-js vjs-medieteknik vjs-big-play-centered vjs-16-9" 
        />
      </div>
    
  );
}

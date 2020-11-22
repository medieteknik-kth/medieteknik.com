import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
import Api from '../../Utility/Api';
import Spinner from '../Common/Spinner/Spinner';
import './Video.scss';
import VideoPlayer from './VideoPlayer';

export default function Video() {
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    Api.Videos.GetById(id).then((data) => {
      setVideo(data);
      setIsLoading(false);
      console.log(data);
    });
  }, []);

  const openVideoPlayer = () => {
    setIsOpen(true);
  };

  const closeVideoPlayer = () => {
    setIsOpen(false);
  };

  return (
    isLoading ? <Spinner />
      : (
        <div>
          { isOpen ? <VideoPlayer video={video} handleClose={closeVideoPlayer} /> : <div /> }
          <div className="videoGalleryItem" onClick={openVideoPlayer} onKeyDown={(e) => { if (e.key === 'Enter') openVideoPlayer(); }} role="button" tabIndex={0}>
            <div className="videoGalleryItemPlayIcon">
              <FontAwesomeIcon icon={faPlayCircle} color="white" size="3x" />
            </div>
            <img src={video.thumbnail} alt={video.title} />
          </div>
        </div>
      )
  );
}

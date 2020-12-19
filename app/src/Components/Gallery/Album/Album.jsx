import React, { useState, useEffect } from 'react';
import './Album.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
import AlbumModal from '../AlbumModal/AlbumModal';
import AlbumVideoModal from '../AlbumModal/AlbumVideoModal';
import Api from '../../../Utility/Api';


const Album = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    Api.Albums.GetById(id).then((album) => {
      setData(album);
    });
  }, []);

  const viewImage = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
    setIsVideo(false);
  };

  const viewVideo = (video) => {
    setCurrentImage({
      src: video.url,
      title: video.title,
      date: video.uploadedAt,
    });
    setModalOpen(true);
    setIsVideo(true);
  };

  const modal = () => (!isVideo ? (
    <AlbumModal
      image={currentImage.src}
      title={currentImage.title}
      date={new Date(currentImage.date)}
      photographer={currentImage.photographer}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    />
  ) : (
    <AlbumVideoModal
      title={currentImage.title}
      videoUrl={currentImage.src}
      date={new Date(currentImage.date)}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    />
  ));

  console.log(currentImage == null ? false : currentImage);

  return (
    data == null ? <div /> : (
      <>
        { currentImage
          ? (
            modal()
          ) : <></>}
        <div className="album-header">
          <h2>{data.title}</h2>
          <h5>{data.date ? new Date(data.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : <></>}</h5>
        </div>
        <div className="album-container">
          <div className="album-grid">
            {data.videos.map((video) => (
              <div
                key={video.id}
                className="album-cell no-select"
                onClick={() => viewVideo(video)}
              >
                <div className="album-video-play-icon">
                  <FontAwesomeIcon icon={faPlayCircle} color="white" size="3x" />
                </div>
                <img src={video.thumbnail} className="responsive-image" alt="" />
              </div>
            ))}
            {data.images.map((image) => (
              <div
                key={image.url}
                className="album-cell no-select"
                onClick={() => viewImage({
                  src: image.url, title: data.title, date: image.date, photographer: image.photographer,
                })}
              >
                <img src={image.url} className="responsive-image" alt="" />
              </div>
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default Album;

import React, { useState, useEffect } from 'react';
import 'swiper/css/swiper.min.css';
import './Swiper.css';
import ReactIdSwiperCustom from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Swiper, Navigation } from 'swiper/js/swiper.esm';
import useWindowDimensions from '../../../Hooks/useWindowDimensions';
import AlbumModal from '../AlbumModal/AlbumModal';
import AlbumVideoModal from '../AlbumModal/AlbumVideoModal';

const CustomBuildSwiper = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  const params = {
    Swiper,
    modules: [Navigation],
    slidesPerView: 'auto',
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  const viewImage = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
    setIsVideo(false);
  };

  const viewVideo = (video) => {
    setCurrentImage(video);
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

  return (
    <>
      { currentImage
        ? modal()
        : <></>}
      <ReactIdSwiperCustom {...params}>
        {props.videos.map((video, key) => (
          <div key={key} className="swiper-slide no-select">
            <img
              src={video.thumbnail}
              alt="#"
              className="img-fluid"
              onClick={() => viewVideo({ src: video.url, title: video.title, date: new Date(video.uploadedAt) })}
            />
          </div>
        ))}
        {props.images.map((image, key) => (
          <div key={key} className="swiper-slide no-select">
            <img
              src={image.url}
              alt="#"
              className="img-fluid"
              onClick={() => viewImage({
                src: image.url, title: props.title, date: new Date(image.date), photographer: image.photographer,
              })}
            />
          </div>
        ))}
      </ReactIdSwiperCustom>
    </>
  );
};

export default CustomBuildSwiper;

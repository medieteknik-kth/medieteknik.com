import React, { useState, useEffect } from 'react';
import './Album.css';
import { useParams } from 'react-router-dom';
import AlbumModal from '../AlbumModal/AlbumModal';
import Api from '../../../Utility/Api';


const Album = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
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
  };

  console.log(currentImage == null ? false : currentImage);

  return (
    data == null ? <div /> : (
      <>
        { currentImage
          ? (
            <AlbumModal
              image={currentImage.src}
              title={currentImage.title}
              date={new Date(currentImage.date)}
              photographer={currentImage.photographer}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
            />
          ) : <></>}
        <div className="album-header">
          <h2>{data.title}</h2>
          <h5>{data.date ? new Date(data.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : <></>}</h5>
        </div>
        <div className="album-container">
          <div className="album-grid">
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

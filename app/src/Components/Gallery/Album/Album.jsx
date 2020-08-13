import React, { useState } from 'react';
import './Album.css'
import AlbumModal from '../AlbumModal/AlbumModal';

const Album = () => {
    
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    const testData = {
        title: 'Paradise Hotel-pub',
        date: new Date(),
        images: [
            { 
                src: 'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/77131074_2843731255660628_659243876111876096_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=CCkxcHQS4rcAX-D-Kl-&_nc_ht=scontent-arn2-2.xx&oh=05699122d8ad08041345c40fb16fae6f&oe=5EED7351', 
                date: new Date(),
                photographer: 'Johanna Nilsen'
            },
            { 
                src: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-0/p180x540/78172745_2843731395660614_7546236983358521344_o.jpg?_nc_cat=111&_nc_sid=e007fa&_nc_ohc=sUpANMlnq0wAX-2heBz&_nc_ht=scontent-arn2-1.xx&_nc_tp=6&oh=4ab76f79ac3f1629f75318358ff084ed&oe=5EEEEEEA', 
                date: new Date(),
                photographer: 'Johanna Nilsen'
            },
            { 
                src: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-0/p180x540/78104672_2843731465660607_8297238149940117504_o.jpg?_nc_cat=106&_nc_sid=e007fa&_nc_ohc=Yqf2ElwYf8UAX9NI7yd&_nc_ht=scontent-arn2-1.xx&_nc_tp=6&oh=77f545c9392b96a031a7ce297459b3ff&oe=5EF17F37', 
                date: new Date(),
                photographer: 'Johanna Nilsen'
            },
            { 
                src: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-0/p180x540/77103161_2843731495660604_6819384016995614720_o.jpg?_nc_cat=106&_nc_sid=e007fa&_nc_ohc=QBdIx4vnYYIAX-E6RBm&_nc_ht=scontent-arn2-1.xx&_nc_tp=6&oh=b8f7f5c5cd35d20c2e939e454f78d7ba&oe=5EF1920A', 
                date: new Date(),
                photographer: 'Johanna Nilsen'
            },
            { 
                src: 'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-0/p180x540/76710684_2843733202327100_7743059597774028800_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=uG03zMFbZ5MAX-m8E3b&_nc_ht=scontent-arn2-2.xx&_nc_tp=6&oh=7d5a393e08c6eddde17b38cd887f1b5c&oe=5EEEC195', 
                date: new Date(),
                photographer: 'Johanna Nilsen'
            },
            { 
                src: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-0/p180x540/76705129_2843731578993929_8885035833493553152_o.jpg?_nc_cat=111&_nc_sid=e007fa&_nc_ohc=r5MwFTMEIe8AX95qxJQ&_nc_ht=scontent-arn2-1.xx&_nc_tp=6&oh=1c583f299d6bfd6d084dcacf50fe6c6b&oe=5EEE2597', 
                date: new Date(),
                photographer: 'Johanna Nilsen'
            },
        ]
    }

    const viewImage = (image) => {
        setCurrentImage(image)
        setModalOpen(true)
    }

    return (<>
        { currentImage ? 
            <AlbumModal 
                image={currentImage.src} 
                title={currentImage.title}
                date={currentImage.date}
                photographer={currentImage.photographer}
                modalOpen={modalOpen} 
                setModalOpen={setModalOpen} /> : <></>
        }
        <div className='album-header'>
            <h2>{testData.title}</h2>
            <h5>{testData.date.toLocaleDateString('sv-SE', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, ' ')}</h5>
        </div>
        <div className='album-container'> 
            <div className='album-grid'>
                {testData.images.map(image =>
                    <div key={image.src} className='album-cell no-select' onClick={() => viewImage({src: image.src, title: testData.title, date: image.date, photographer: image.photographer })}>
                        <img src={image.src} className='responsive-image' alt='' />
                    </div>
                )}
            </div>
        </div>
    </>);
}

export default Album;
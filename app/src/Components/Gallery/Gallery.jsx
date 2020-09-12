import React, { Fragment } from 'react';
import './Gallery.css'
import AlbumPreview from './AlbumPreview/AlbumPreview';
import { LocaleText } from '../../Contexts/LocaleContext';

const Gallery = () => {

    const gallery = [
        {
            year: 2019,
            albums: [
                {
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
                },
                {
                    title: 'Företagspub med Bonnier',
                    date: new Date(),
                    images: [
                        { 
                            src: 'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/75627603_2843778568989230_102882857789161472_o.jpg?_nc_cat=105&_nc_sid=e007fa&_nc_ohc=wRzJyO2HzkUAX9LP-3d&_nc_ht=scontent-arn2-2.xx&oh=ca6bd0078bf0fa97bc73674a51fd0d03&oe=5EEEF116', 
                            date: new Date(),
                            photographer: 'Anton Martinsson'
                        },
                        {
                            src: 'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/s960x960/76246700_2843777488989338_8959454873565265920_o.jpg?_nc_cat=105&_nc_sid=e007fa&_nc_ohc=poByPB2N6jgAX80Y73m&_nc_ht=scontent-arn2-2.xx&_nc_tp=7&oh=c3b3bfa2a4439dadaaf133e026b05ecc&oe=5EF0E1F8',
                            date: new Date(),
                            photographer: 'Johanna Nilsen'
                        },
                        { 
                            src: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/74666303_2843780022322418_5581217689419907072_o.jpg?_nc_cat=107&_nc_sid=e007fa&_nc_ohc=l2pKMG2uk2sAX_ZiPLH&_nc_ht=scontent-arn2-1.xx&oh=4a3aed6b6908c43ea1492aec0612137a&oe=5EEF24A4', 
                            date: new Date(),
                            photographer: 'Anton Martinsson'
                        },
                        { 
                            src: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/75625352_2843780362322384_4078897103475048448_o.jpg?_nc_cat=109&_nc_sid=e007fa&_nc_ohc=mxH8-x3NL4wAX-jGgOH&_nc_ht=scontent-arn2-1.xx&oh=1a8a0417361a696a9f946644ce598d12&oe=5EEE1AB6', 
                            date: new Date(),
                            photographer: 'Anton Martinsson'
                        },
                        { 
                            src: 'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/78302073_2843780985655655_6328095769001721856_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=jxYlVmZ19L4AX-XIlqZ&_nc_ht=scontent-arn2-2.xx&oh=9c32b6610ddbd9d24c9d1f596201bdcb&oe=5EEF59A0', 
                            date: new Date(),
                            photographer: 'Anton Martinsson'
                        },
                        { 
                            src: 'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/79147367_2843780732322347_987878916582539264_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=QyY5bCWZEhAAX8e0bVU&_nc_ht=scontent-arn2-2.xx&oh=cfc68c4a12458a4c65dfeb96fd11087d&oe=5EEEE7AF', 
                            date: new Date(),
                            photographer: 'Anton Martinsson'
                        },
                    ]
                }
            ]
        },
        {
            year: 2018,
            albums: [
                {
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
                },
                {
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
            ]
        }
    ]

    return (<div>
        <div className='gallery-header'>
            <h2>
                <LocaleText phrase='gallery/gallery_header'/>
            </h2>
        </div>
        <div className='gallery-content'>
            {gallery.map((g, i) => {
                return <Fragment key={i}>
                    <h2>{g.year}</h2>
                    {g.albums.map((album, index) => 
                        <AlbumPreview key={index} title={album.title} images={album.images} />
                    )}
                </Fragment>
            })}
        </div>
    </div>);
}

export default Gallery;
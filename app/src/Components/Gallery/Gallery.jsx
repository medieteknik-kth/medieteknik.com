import React, { useState, useEffect } from 'react';
import './Gallery.css'
import CustomBuildSwiper from './Swiper/Swiper';
import AlbumPreview from './AlbumPreview/AlbumPreview';

const Gallery = (props) => {

    const albums = [
        {
            title: 'Paradise Hotel-pub',
            images:  ['https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/77131074_2843731255660628_659243876111876096_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=CCkxcHQS4rcAX-D-Kl-&_nc_ht=scontent-arn2-2.xx&oh=05699122d8ad08041345c40fb16fae6f&oe=5EED7351',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/72486219_2843733035660450_1368411197942005760_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=nUEPjsoFStcAX9ynWga&_nc_ht=scontent-arn2-2.xx&oh=ac07706cd7155b54586ee0abdc2f3d9c&oe=5EED3199',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/77103161_2843731495660604_6819384016995614720_o.jpg?_nc_cat=106&_nc_sid=e007fa&_nc_ohc=QBdIx4vnYYIAX-E6RBm&_nc_ht=scontent-arn2-1.xx&oh=0e6cb8c4adb8583f8d4c9fa9dc41da2f&oe=5EF0869F',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/78186193_2843732788993808_1112214135287840768_o.jpg?_nc_cat=111&_nc_sid=e007fa&_nc_ohc=EDp34-E-3NMAX8zSsVg&_nc_ht=scontent-arn2-1.xx&oh=52fe8da486c5d4b9f4feea17291480c5&oe=5EEF2D44',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/78104672_2843731465660607_8297238149940117504_o.jpg?_nc_cat=106&_nc_sid=e007fa&_nc_ohc=MtQloGgX1lUAX_ez8Qm&_nc_ht=scontent-arn2-1.xx&oh=2ab1f01a57fdb64146e78ef5dbccd37d&oe=5EEDACA2']
        }, {
            title: 'Företagspub med Bonnier',
            images:  ['https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/75627603_2843778568989230_102882857789161472_o.jpg?_nc_cat=105&_nc_sid=e007fa&_nc_ohc=wRzJyO2HzkUAX9LP-3d&_nc_ht=scontent-arn2-2.xx&oh=ca6bd0078bf0fa97bc73674a51fd0d03&oe=5EEEF116',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/75625352_2843780362322384_4078897103475048448_o.jpg?_nc_cat=109&_nc_sid=e007fa&_nc_ohc=mxH8-x3NL4wAX-jGgOH&_nc_ht=scontent-arn2-1.xx&oh=1a8a0417361a696a9f946644ce598d12&oe=5EEE1AB6',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/78302073_2843780985655655_6328095769001721856_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=jxYlVmZ19L4AX-XIlqZ&_nc_ht=scontent-arn2-2.xx&oh=9c32b6610ddbd9d24c9d1f596201bdcb&oe=5EEF59A0',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/79147367_2843780732322347_987878916582539264_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=QyY5bCWZEhAAX8e0bVU&_nc_ht=scontent-arn2-2.xx&oh=cfc68c4a12458a4c65dfeb96fd11087d&oe=5EEEE7AF',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/74435074_2843778322322588_5995231938091155456_o.jpg?_nc_cat=107&_nc_sid=e007fa&_nc_ohc=hoGyV1l3GV0AX_Wvwxx&_nc_ht=scontent-arn2-1.xx&oh=85eb806a7df7f744d79f610c0ccfff13&oe=5EEF72F0',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/76705151_2843779155655838_860673109240315904_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=raR52Fv7hswAX-3Rc_5&_nc_ht=scontent-arn2-2.xx&oh=ffdf9bcfbbf38c2e2112fd3bbfef1640&oe=5EF0DDCE']
        }, {
            title: 'Test',
            images:  ['https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/75627603_2843778568989230_102882857789161472_o.jpg?_nc_cat=105&_nc_sid=e007fa&_nc_ohc=wRzJyO2HzkUAX9LP-3d&_nc_ht=scontent-arn2-2.xx&oh=ca6bd0078bf0fa97bc73674a51fd0d03&oe=5EEEF116',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/75625352_2843780362322384_4078897103475048448_o.jpg?_nc_cat=109&_nc_sid=e007fa&_nc_ohc=mxH8-x3NL4wAX-jGgOH&_nc_ht=scontent-arn2-1.xx&oh=1a8a0417361a696a9f946644ce598d12&oe=5EEE1AB6',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/78302073_2843780985655655_6328095769001721856_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=jxYlVmZ19L4AX-XIlqZ&_nc_ht=scontent-arn2-2.xx&oh=9c32b6610ddbd9d24c9d1f596201bdcb&oe=5EEF59A0',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/79147367_2843780732322347_987878916582539264_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=QyY5bCWZEhAAX8e0bVU&_nc_ht=scontent-arn2-2.xx&oh=cfc68c4a12458a4c65dfeb96fd11087d&oe=5EEEE7AF',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/74435074_2843778322322588_5995231938091155456_o.jpg?_nc_cat=107&_nc_sid=e007fa&_nc_ohc=hoGyV1l3GV0AX_Wvwxx&_nc_ht=scontent-arn2-1.xx&oh=85eb806a7df7f744d79f610c0ccfff13&oe=5EEF72F0',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/76705151_2843779155655838_860673109240315904_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=raR52Fv7hswAX-3Rc_5&_nc_ht=scontent-arn2-2.xx&oh=ffdf9bcfbbf38c2e2112fd3bbfef1640&oe=5EF0DDCE']
        }, {
            title: 'Test 2',
            images:  ['https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/75627603_2843778568989230_102882857789161472_o.jpg?_nc_cat=105&_nc_sid=e007fa&_nc_ohc=wRzJyO2HzkUAX9LP-3d&_nc_ht=scontent-arn2-2.xx&oh=ca6bd0078bf0fa97bc73674a51fd0d03&oe=5EEEF116',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/75625352_2843780362322384_4078897103475048448_o.jpg?_nc_cat=109&_nc_sid=e007fa&_nc_ohc=mxH8-x3NL4wAX-jGgOH&_nc_ht=scontent-arn2-1.xx&oh=1a8a0417361a696a9f946644ce598d12&oe=5EEE1AB6',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/78302073_2843780985655655_6328095769001721856_o.jpg?_nc_cat=108&_nc_sid=e007fa&_nc_ohc=jxYlVmZ19L4AX-XIlqZ&_nc_ht=scontent-arn2-2.xx&oh=9c32b6610ddbd9d24c9d1f596201bdcb&oe=5EEF59A0',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/79147367_2843780732322347_987878916582539264_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=QyY5bCWZEhAAX8e0bVU&_nc_ht=scontent-arn2-2.xx&oh=cfc68c4a12458a4c65dfeb96fd11087d&oe=5EEEE7AF',
            'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/74435074_2843778322322588_5995231938091155456_o.jpg?_nc_cat=107&_nc_sid=e007fa&_nc_ohc=hoGyV1l3GV0AX_Wvwxx&_nc_ht=scontent-arn2-1.xx&oh=85eb806a7df7f744d79f610c0ccfff13&oe=5EEF72F0',
            'https://scontent-arn2-2.xx.fbcdn.net/v/t1.0-9/76705151_2843779155655838_860673109240315904_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=raR52Fv7hswAX-3Rc_5&_nc_ht=scontent-arn2-2.xx&oh=ffdf9bcfbbf38c2e2112fd3bbfef1640&oe=5EF0DDCE']
        }
    ]

    return (<div>
        <div className='gallery-header'>
            <h1>Gallery</h1>
        </div>
        <div className='gallery-content'>
            <h2>2019</h2>
            {albums.map(album => <AlbumPreview title={album.title} images={album.images} />)}
        </div>
    </div>);
}

export default Gallery;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleContext, LocaleText, translateToString } from '../../Contexts/LocaleContext';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import Api from '../../Utility/Api'
import './AlbumUpload.css'

const AlbumUpload = () => {
    const [images, setImages] = useState([]);
    const [previewURLs, setPreviewURLs] = useState([])
    const [title, setTitle] = useState(null)
    const [includeDate, setIncludeDate] = useState(false)
    const [photographer, setPhotographer] = useState(null)
    const { lang } = useContext(LocaleContext);

    const handleFileChange = (files) => {
        console.log(files)
        const urls = Array.from(files).map(file => ({ url: URL.createObjectURL(file), title: file.name }))
        setImages([...images, ...files])
        setPreviewURLs([...previewURLs, ...urls])
    }

    const removeImage = (imgToRemove, previewToRemove) => {
        setImages(images.filter(img => !(img.name === imgToRemove)))
        setPreviewURLs(previewURLs.filter(url => !(url === previewToRemove)))
    }

    return (
        <div className="upload-container">
            <form encType="multipart/form-data" action="">
                <h2>Ladda upp bilder</h2>
                <div className="info-container">
                    <div>
                        <label style={{ display: "none" }}>Namn på album</label>
                        <input type="text" onChange={e => setTitle(e.target.value)} placeholder="Namn på album"></input>
                    </div>
                    <div>
                        <label style={{ display: "none" }}>Namn på fotograf</label>
                        {/* Har fått för mig att detta är bra för screen readers */}
                        <input type="text" onChange={e => setPhotographer(e.target.value)} placeholder="Namn på fotograf"></input>
                    </div>
                </div>
                <div className="info-container">
                    <div>
                        <input type="date" placeholder="datum"></input>
                    </div>
                </div>
                <div className="preview-container">
                    {previewURLs &&
                        <div className="previews">
                            {
                                previewURLs.map(preview => (<div className="preview" key={preview.url} >
                                    
                                    <img className="preview-img" src={preview.url}/>
                                        <FontAwesomeIcon className="cancel-img-upload" onClick={(e) => { e.preventDefault(); removeImage(preview.title, preview) }} size="2x" icon={faTimes} color="#f0c900" />
                                </div>))
                            }
                        </div>
                    }
                    <div className="yellow-image-upload">
                        <label htmlFor="files" ><FontAwesomeIcon size="2x" icon={faPlus} color="#f0c900" /></label>
                        <input type="file" name="files" accept="image/png, image/jpeg" onChange={e => handleFileChange(e.target.files)} multiple id="files" style={{ visibility: "hidden" }}></input>
                    </div>
                </div>
            </form>
        </div >
    )
}

export default AlbumUpload
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleText, localeDate } from '../../Contexts/LocaleContext'
import Api from '../../Utility/Api'
import './AlbumUpload.css'

const AlbumUpload = () => {
    const [images, setImages] = useState([]);
    const [previewURLs, setPreviewURLs] = useState([])
    const [title, setTitle] = useState("albumtitel")
    const handleFileChange = (files) => {
        console.log(files)
        const urls = Array.from(files).map(file => ({ url: URL.createObjectURL(file), title: file.name }))
        setImages(files)
        setPreviewURLs(urls)
    }

    return (
        <div className="upload-container">
            <form encType="multipart/form-data" action="">
                <h2><input className="title-input" type="text" placeholder={title} onChange={e => setTitle(e.target.value)}></input></h2>
                {previewURLs && <div className="preview-container">
                    <div className="previews">
                        {
                            previewURLs.map(preview => (<div className="preview" key={preview.url}>
                                <img className="preview-img" src={preview.url} />
                                <p className="img-title">{preview.title}</p>
                            </div>))
                        }
                    </div>
                </div>}
                <label for="files" className="upload-button">{<LocaleText phrase="gallery/select_images" />}</label>
                <input type="file" name="fileInput" accept="image/png, image/jpeg" onChange={e => handleFileChange(e.target.files)} multiple id="files" style={{ visibility: "hidden" }}></input>
            </form>
        </div>
    )
}

export default AlbumUpload
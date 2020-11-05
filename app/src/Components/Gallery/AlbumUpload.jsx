import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleContext, LocaleText, translateToString } from '../../Contexts/LocaleContext'
import Api from '../../Utility/Api'
import './AlbumUpload.css'

const AlbumUpload = () => {
    const [images, setImages] = useState([]);
    const [previewURLs, setPreviewURLs] = useState([])
    const [title, setTitle] = useState(null)
    const [includeDate, setIncludeDate] = useState(false)
    const [description, setDescription] = useState(null)
    const {lang} = useContext(LocaleContext);

    const handleFileChange = (files) => {
        console.log(files)
        const urls = Array.from(files).map(file => ({ url: URL.createObjectURL(file), title: file.name }))
        setImages(files)
        setPreviewURLs(urls)
    }
    
    return (
        <div className="upload-container">
            <form encType="multipart/form-data" action="">
                <h2><input className="title-input" type="text" placeholder={translateToString({
                    se: "Albumtitel",
                    en: "Album name",
                    lang
                })} onChange={e => setTitle(e.target.value)}></input></h2>
                <span className="desc-input" type="text" role="textbox" contentEditable placeholder={translateToString({
                    se: "Beskrivning",
                    en: "Description",
                    lang
                })}><LocaleText phrase="gallery/desc_placeholder"/></span>
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
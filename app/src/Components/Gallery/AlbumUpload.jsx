import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleContext, LocaleText, translateToString } from '../../Contexts/LocaleContext';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../Common/Button/Button'
import DatePicker from '../Common/Form/DatePicker';
import Input from '../Common/Form/Input';
import Switch from '../Common/Form/Switch';

import Api from '../../Utility/Api'
import './AlbumUpload.css'

const AlbumUpload = () => {
    const [images, setImages] = useState([]);
    const [previewURLs, setPreviewURLs] = useState([])
    const [title, setTitle] = useState(null)
    const [includeDate, setIncludeDate] = useState(false)
    const [photographer, setPhotographer] = useState(null)
    const [date, setDate] = useState(new Date());
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
                    <div className="input-container">
                        <Input placeholder="Namn på album" onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <Input placeholder="Namn på fotograf" onChange={e => setPhotographer(e.target.value)} />
                    </div>
                </div>
                <div className="date-container info-container">
                    <DatePicker onChange={setDate} value={date} className="date-picker"/>
                    <div className="date-includer">
                        <input type="checkbox" defaultChecked={!includeDate} onChange={e => setIncludeDate(!e.target.checked)}></input>
                        <p>Jag vill inte välja datum för detta album</p>
                    </div>
                </div>
                <div className="preview-container">
                    {previewURLs &&
                        <div className="previews">
                            {
                                previewURLs.map(preview => (<div className="preview" key={preview.url} >

                                    <img className="preview-img" src={preview.url} />
                                    <FontAwesomeIcon className="cancel-img-upload" onClick={(e) => { e.preventDefault(); removeImage(preview.title, preview) }} size="2x" icon={faTimes} color="#f0c900" />
                                </div>))
                            }
                            <div className="yellow-image-upload">
                                <label htmlFor="files" ><FontAwesomeIcon size="2x" icon={faPlus} color="#f0c900" /></label>
                                <input type="file" name="files" accept="image/png, image/jpeg" onChange={e => handleFileChange(e.target.files)} multiple id="files" style={{ visibility: "hidden" }}></input>
                            </div>
                        </div>
                    }

                </div>
            </form>
            <Button>Ladda upp album</Button>
        </div >
    )
}

export default AlbumUpload
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LocaleContext, LocaleText, translateToString } from '../../../Contexts/LocaleContext';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Common/Button/Button'
import DatePicker from '../../Common/Form/DatePicker';
import Input from '../../Common/Form/Input';
import Checkbox from '../../Common/Checkbox/checkbox';
import { Redirect } from 'react-router-dom'

import Api from '../../../Utility/Api'
import './AlbumUpload.css'

const AlbumUpload = () => {
    const [images, setImages] = useState([]);
    const [previewURLs, setPreviewURLs] = useState([])
    const [title, setTitle] = useState(null)
    const [includeDate, setIncludeDate] = useState(true)
    const [photographer, setPhotographer] = useState(null)
    const [redirect, setRedirect] = useState(false);
    const [albumId, setAlbumId] = useState(null);
    const [date, setDate] = useState(new Date());
    const [needsCred, setNeedsCred] = useState(true);
    const [editingAllowed, setEditingAllowed] = useState(false);
    const [receptionAppropriate, setReceptionAppropriate] = useState(false);
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

    const uploadAlbum = () => {
        const body = {
            name: title,
            receptionAppropriate,
            needsCred,
            editingAllowed
        }

        const formData = new FormData();
        Object.keys(body).map(key => formData.append(key, body[key]));
        if (includeDate) {
            formData.append("albumDate", date.toISOString())
            console.log(date.toISOString())
        }
        if (photographer) {
            formData.append("photographer", photographer)
        }
        //append images 
        for (let image of images) {
            formData.append("photos", image);
        }
        Api.Albums.PostForm(formData)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setAlbumId(res.id)
                    setRedirect(true)
                }
            })
    }

    if (redirect) {
        return <Redirect to={`/album/${albumId}`} />
    }

    return (
        <div className="upload-container">
            <div className="form-container">
                <form encType="multipart/form-data" action="">
                    <div className="info-container">
                        <div className="input-container">
                            <Input placeholder="Namn på album" onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <Input placeholder="Namn på fotograf" onChange={e => setPhotographer(e.target.value)} />
                        </div>
                    </div>
                    <div className="date-container info-container">
                        <div class="date-picker-container">
                            <p><LocaleText phrase="feed/create_event/date" /></p>
                            <DatePicker onChange={setDate} value={date} className="date-picker" />
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
                    <div className="info-container">
                        <div className="date-includer">
                            <Checkbox name={(<p><LocaleText phrase="gallery/upload_date" /></p>)} checkboxHandler={() => setIncludeDate(!includeDate)} isChecked={!includeDate} colorTheme="light" />

                        </div>
                        <div className="date-includer">
                            <Checkbox name={(<p><LocaleText phrase="gallery/upload_reception" /></p>)} checkboxHandler={() => setReceptionAppropriate(!receptionAppropriate)} isChecked={receptionAppropriate} colorTheme="light" />
                        </div>
                        <div className="date-includer">
                            <Checkbox name={(<p><LocaleText phrase="gallery/upload_credit" /></p>)} checkboxHandler={() => setNeedsCred(!needsCred)} isChecked={needsCred} colorTheme="light" />
                        </div>
                        <div className="date-includer">
                            <Checkbox name={(<p><LocaleText phrase="gallery/upload_edit" /></p>)} checkboxHandler={() => setEditingAllowed(!editingAllowed)} isChecked={editingAllowed} colorTheme="light" />
                        </div>
                    </div>
                </form>
                <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                    <Button onClick={() => uploadAlbum()}><p><LocaleText phrase="gallery/upload_upload" /></p></Button>
                </div>
            </div>

        </div >
    )
}

export default AlbumUpload
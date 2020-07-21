import React, { useState, useEffect } from 'react'
import './CreatePost.scss'
import Input from '../Common/Form/Input'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Dropdown from '../Common/Form/Dropdown'
import YellowImageUpload from '../Common/Form/YellowImageUpload'
import Api from '../../Utility/Api.js'
import Button from '../Common/Button/Button'
import { NavLink, Redirect } from 'react-router-dom'
import { LocaleText, translate } from '../../Contexts/LocaleContext'

const CreatePost = (props) => {
    const [committees, setCommittees] = useState([])
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [committeeId, setCommitteeId] = useState(null)
    const [headerImage, setHeaderImage] = useState(null)
    const [hasError, setHasError] = useState(false)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        Api.Committees.GetAll().then((data) => {
            setCommittees(
                data.length > 0
                    ? data.map((committee) => {
                          return { label: committee.name, value: committee.id }
                      })
                    : []
            )
        })
    }, [])

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })

    const checkEmptyQuillBody = (str) => {
        return str === '<p><br></p>' || str === ''
    }

    async function addPost(formData) {
        const header_image = headerImage ? await toBase64(headerImage) : null
        if (checkEmptyQuillBody(body)) {
            setHasError(true)
            return
        }
        console.log(headerImage)
        const postData = {
            body,
            body_en: body,
            committee_id: committeeId,
            title,
            title_en: title,
            header_image,
        }
        console.log(postData)
        return Api.Post.Create(postData)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    console.log(res)
                    setRedirect(true)
                } else {
                    setHasError(true)
                }
            })
            .catch((res) => setHasError(true))
    }

    if (redirect) {
        return <Redirect to="/feed" />
    }

    return (
        <>
            <div className="create-post-header">
                <NavLink to="/feed">
                    <Button small>
                        <LocaleText phrase="feed/header" />
                    </Button>
                </NavLink>
            </div>
            <div className="create-post-container">
                <div className="create-post">
                    <h1>
                        <LocaleText phrase="feed/create_post/header" />
                    </h1>
                    <h5>
                        <LocaleText phrase="feed/create_post/title" />
                    </h5>
                    <div className="title-input">
                        <Input
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                            hasError={hasError && title.length === 0}
                            errorMsg="Du måste skriva en titel"
                        />
                    </div>
                    <h5>
                        <LocaleText phrase="feed/create_post/body" />
                    </h5>
                    <ReactQuill theme="snow" onChange={(val) => setBody(val)} />
                    {hasError && checkEmptyQuillBody(body) && (
                        <div className="error-msg">
                            <p>Du måste skriva en inläggstext.</p>
                        </div>
                    )}
                    <div className="post-extras">
                        <div className="extras-select">
                            <h5>
                                <LocaleText phrase="feed/create_post/committee" />
                            </h5>
                            <Dropdown
                                options={[
                                    {
                                        label: translate({
                                            se: 'Välj nämnd',
                                            en: 'Choose committee',
                                        }),
                                        value: null,
                                    },
                                    ...committees,
                                ]}
                                isLoading={committees.length === 0}
                                onChange={(option) =>
                                    setCommitteeId(option.value)
                                }
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                            }}
                        >
                            <h5>
                                <LocaleText phrase="feed/create_post/image" />
                            </h5>
                            <YellowImageUpload
                                onChange={(image) => setHeaderImage(image)}
                            />
                        </div>
                    </div>
                    <div className="create-button">
                        <Button onClick={addPost}>
                            <LocaleText phrase="feed/create_post/create" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost

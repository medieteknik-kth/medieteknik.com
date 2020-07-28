import React, { useState, useEffect, useContext } from 'react'
import './CreatePost.scss'
import Input from '../Common/Form/Input'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Dropdown from '../Common/Form/Dropdown'
import YellowImageUpload from '../Common/Form/YellowImageUpload'
import Api from '../../Utility/Api.js'
import Button from '../Common/Button/Button'
import { NavLink, Redirect } from 'react-router-dom'
import {
    LocaleText,
    LocaleContext,
    translate,
    translateToString,
} from '../../Contexts/LocaleContext'
import Switch from '../Common/Form/Switch'
import TimePicker from '../Common/Form/TimePicker'
import DatePicker from '../Common/Form/DatePicker'

const CreatePost = ({ event }) => {
    const [committees, setCommittees] = useState([])
    const [title, setTitle] = useState('')
    const [enTitle, setEnTitle] = useState('')
    const [body, setBody] = useState('')
    const [enBody, setEnBody] = useState('')
    const [committeeId, setCommitteeId] = useState(null)
    const [headerImage, setHeaderImage] = useState(null)
    const [hasError, setHasError] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const [useEn, setUseEn] = useState(false)
    const { lang } = useContext(LocaleContext)

    const [startDate, setStartDate] = useState(new Date())
    const [startTime, setStartTime] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())

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

    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }

    const checkEmptyQuillBody = (str) => {
        return str === '<p><br></p>' || str === ''
    }

    const triggerError = () => {
        scrollToTop()
        setHasError(true)
    }

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })

    async function addPost() {
        {
            /*TODO sync header image front- and back-end*/
        }
        const header_image = headerImage ? await toBase64(headerImage) : null
        if (checkEmptyQuillBody(body)) {
            triggerError()
            return
        }
        var postData = {
            body,
            body_en: useEn ? enBody : body,
            committee_id: committeeId,
            title,
            title_en: useEn ? enTitle : title,
            header_image,
        }
        postData = event
            ? {
                  ...postData,
                  ...{
                      date: `${startDate.toLocaleDateString()} ${startTime.toLocaleTimeString(
                          [],
                          {
                              hour: '2-digit',
                              minute: '2-digit',
                          }
                      )}`,
                      end_date: `${endDate.toLocaleDateString()} ${endTime.toLocaleTimeString(
                          [],
                          {
                              hour: '2-digit',
                              minute: '2-digit',
                          }
                      )}`,
                  },
              }
            : postData
        return event
            ? Api.Events.Create(postData)
                  .then((res) => res.json())
                  .then((res) => {
                      if (res.success) {
                          console.log(res)
                          setRedirect(true)
                      } else {
                          triggerError()
                      }
                  })
                  .catch((res) => {
                      triggerError()
                  })
            : Api.Post.Create(postData)
                  .then((res) => res.json())
                  .then((res) => {
                      if (res.success) {
                          console.log(res)
                          setRedirect(true)
                      } else {
                          triggerError()
                      }
                  })
                  .catch((res) => {
                      triggerError()
                  })
    }

    if (redirect) {
        return <Redirect to='/feed' />
    }

    return (
        <>
            <div className='create-post-header'>
                <NavLink to='/feed'>
                    <Button small>
                        <LocaleText phrase='feed/header' />
                    </Button>
                </NavLink>
            </div>
            <div className='create-post-container'>
                <div className='create-post'>
                    <h1>
                        <LocaleText
                            phrase={`feed/${
                                event ? 'create_event' : 'create_post'
                            }/header`}
                        />
                    </h1>
                    <h5>
                        <LocaleText phrase='feed/create_post/title' />
                    </h5>
                    <div className='title-input'>
                        <Input
                            placeholder={translateToString({
                                se: 'Titel',
                                en: 'Title',
                                lang,
                            })}
                            onChange={(e) => setTitle(e.target.value)}
                            hasError={hasError && title.length === 0}
                            errorMsg={translateToString({
                                se: 'Du måste skriva en titel',
                                en: 'You have to provide a title',
                                lang,
                            })}
                        />
                        {useEn && (
                            <Input
                                placeholder={translateToString({
                                    se: 'Engelsk titel',
                                    en: 'English title',
                                    lang,
                                })}
                                inputStyle={{
                                    borderLeft: 'thin solid #ededed',
                                }}
                                onChange={(e) => setEnTitle(e.target.value)}
                                hasError={hasError && enTitle.length === 0}
                                errorMsg={translate({
                                    se: 'Du måste skriva en engelsk titel',
                                    en: 'You have to provide an English title',
                                })}
                            />
                        )}
                    </div>
                    <div className='body-input'>
                        <h5>
                            <LocaleText phrase='feed/create_post/body' />
                        </h5>
                        <ReactQuill
                            placeholder={translateToString({
                                se: 'Text',
                                en: 'Body',
                                lang,
                            })}
                            theme='snow'
                            onChange={(val) => setBody(val)}
                        />
                        {hasError && checkEmptyQuillBody(body) && (
                            <div className='error-msg'>
                                <p>
                                    <LocaleText phrase='feed/create_post/body_err' />
                                </p>
                            </div>
                        )}
                        {useEn && (
                            <>
                                <h5>
                                    <LocaleText phrase='feed/create_post/body_en' />
                                </h5>
                                <ReactQuill
                                    placeholder={translateToString({
                                        se: 'Engelsk text',
                                        en: 'English body',
                                        lang,
                                    })}
                                    theme='snow'
                                    onChange={(val) => setEnBody(val)}
                                />
                                {hasError && checkEmptyQuillBody(enBody) && (
                                    <div className='error-msg'>
                                        <p>
                                            <LocaleText phrase='feed/create_post/body_err' />
                                        </p>
                                    </div>
                                )}{' '}
                            </>
                        )}
                    </div>
                    {event && (
                        <div className='event-date-time'>
                            <div>
                                <div>
                                    <h5>
                                        <LocaleText phrase='feed/create_event/start' />
                                        <LocaleText phrase='feed/create_event/date' />
                                    </h5>
                                    <DatePicker
                                        onChange={setStartDate}
                                        value={startDate}
                                    />
                                </div>
                                <div>
                                    <h5>
                                        <LocaleText phrase='feed/create_event/start' />
                                        <LocaleText phrase='feed/create_event/time' />
                                    </h5>

                                    <TimePicker
                                        onChange={setStartTime}
                                        value={startTime}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h5>
                                        <LocaleText phrase='feed/create_event/end' />
                                        <LocaleText phrase='feed/create_event/date' />
                                    </h5>
                                    <DatePicker
                                        onChange={setEndDate}
                                        value={endDate}
                                    />
                                </div>
                                <div>
                                    <h5>
                                        <LocaleText phrase='feed/create_event/end' />
                                        <LocaleText phrase='feed/create_event/time' />
                                    </h5>

                                    <TimePicker
                                        onChange={setEndTime}
                                        value={endTime}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='post-extras'>
                        <div className='extras-select'>
                            <h5>
                                <LocaleText phrase='feed/create_post/committee' />
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
                            <h5 className='en-switch-header'>
                                <LocaleText phrase='feed/create_post/en_ver' />
                            </h5>
                            <div className='en-switch-container'>
                                <Switch
                                    checked={useEn}
                                    onClick={() => {
                                        if (!useEn) scrollToTop()
                                        setUseEn(!useEn)
                                    }}
                                />
                            </div>
                        </div>
                        <div className='post-image-upload'>
                            <h5>
                                <LocaleText phrase='feed/create_post/image' />
                            </h5>
                            <YellowImageUpload
                                onChange={(image) => setHeaderImage(image)}
                            />
                        </div>
                    </div>
                    <div className='create-button'>
                        <Button onClick={addPost}>
                            <LocaleText phrase='feed/create_post/create' />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost

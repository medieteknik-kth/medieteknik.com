import React from 'react';
import './Playground.css'
import Dropdown from '../Common/Form/Dropdown';
import FormTitle from '../Common/Form/FormTitle';
import Input from '../Common/Form/Input';
import DocumentUpload from '../Common/Form/DocumentUpload'
import TestThumbnail from '../Document/Assets/testThumbnail2.png'
import Button from '../Common/Button/Button';
import { useState } from 'react';
import { LocaleText } from '../../Contexts/LocaleContext';

const Playground = (props) => {

    const [document, setDocument] = useState();
    const [inputError, setInputError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('Fel fel fel, skriv "Rätt rätt rätt"')

    const checkText = (e) => {
        if(e.target.value !== 'Rätt rätt rätt') {
            setInputError(true)
        } else {
            setInputError(false)
        }
    }

    return (
            <div className='ply-cont'>
                <div className='playground-cont'>
                    <div className='playground'>
                        <h2>Playground</h2>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div className='upload-doc'>
                                <FormTitle><LocaleText phrase='form/title'/></FormTitle>
                                <Input hasError={inputError} errorMsg={errorMsg} onChange={checkText} inputStyle={{width: '500px'}}></Input>
                                <FormTitle><LocaleText phrase='form/doc_type'/></FormTitle>
                                <div style={{width: '50%'}}>
                                    <Dropdown options={[{label: 'Motion', value: 'Motion'}, {label: 'SM-handling', value: 'SM-handling'}]} onChange={(value)=> console.log(value)}/>
                                </div>
                            </div>
                            <DocumentUpload document={document} onUpload={() => setDocument(TestThumbnail)} onChangeFile={() => setDocument(null)}/>
                        </div>
                    </div>
                    <Button><LocaleText phrase='form/save'/></Button>
                </div>
            </div>
        );
}

export default Playground;
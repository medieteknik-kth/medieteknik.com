import React from 'react'
import './Input.scss'
import LeftArrow from './Assets/form-left-arrow.svg'

const Input = ({onChange, errorMsg, hasError, inputStyle, name, noError}) => {      
    return (
        <div className={`input-container ${noError ? 'no-error' : ''}`}>
            <input name={name} className={`input ${hasError ? 'error' : ''}`} onChange={onChange} style={inputStyle}></input>
            <div className={`input-error-msg ${hasError ? 'display': ''}`}>{errorMsg}</div>
        </div>
    );
}

export default Input;
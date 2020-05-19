import React from 'react'
import './Input.css'
import LeftArrow from './Assets/form-left-arrow.svg'

const Input = ({onChange, errorMsg, hasError, inputStyle}) => {      
    return (
        <div className='input-container'>
            <input className={`input ${hasError ? 'error' : ''}`} onChange={onChange} style={inputStyle}></input>
            <div class={`input-error-msg ${hasError ? 'display': ''}`}>{errorMsg}</div>
        </div>
    );
}

export default Input;
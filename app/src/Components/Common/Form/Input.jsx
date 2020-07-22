import React from 'react'
import './Input.scss'

const Input = ({onChange, errorMsg, hasError, inputStyle, name, placeholder}) => {      
    return (
        <div className={`input-container`}>
            <input placeholder={placeholder} name={name} className={`input ${hasError ? 'error' : ''}`} onChange={onChange} style={inputStyle}></input>
            <div className={`input-error-msg ${hasError ? 'display': ''}`}>{errorMsg}</div>
        </div>
    );
}

export default Input;
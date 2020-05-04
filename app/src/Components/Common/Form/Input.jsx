import React from 'react'
import './Input.css'

const Input = ({children, onChange}) => {      
    return (
        <input className='input' onChange={onChange}></input>
    );
}

export default Input;
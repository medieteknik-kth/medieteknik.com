import React from 'react'
import './FormTitle.css'

const FormTitle = (props) => {      
    return (
        <div className='form-title'>
            {props.children}
        </div>
    );
}

export default FormTitle;
import React from 'react';
import './Button.scss'

const Button = ({onClick, children, small}) => {
    return (
        <div className={`button ${small ? 'small' : ''}`} onClick={onClick}>
            {children}
        </div>
    )
}
export default Button;
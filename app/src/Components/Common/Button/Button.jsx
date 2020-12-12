import React from 'react';
import './Button.scss'

const Button = ({onClick, children, small, color}) => {
    return (
        <div className={`button ${small ? 'small' : ''}`} onClick={onClick} style={{backgroundColor: color}}>
            {children}
        </div>
    )
}
export default Button;
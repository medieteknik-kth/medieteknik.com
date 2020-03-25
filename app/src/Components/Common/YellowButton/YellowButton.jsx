import React, { useState, useEffect } from 'react';
import './YellowButton.css'

const YellowButton = (props) => {
    return (
        <button className='yellow-button' onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export default YellowButton;
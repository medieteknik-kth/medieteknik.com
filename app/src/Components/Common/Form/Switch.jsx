import React from 'react'
import './Switch.scss'

const Switch = ({onClick, checked}) => {

    return (
        <div className="switch">
            <input
                type="checkbox"
                name="switch"
                className="switch-checkbox"
                id="switch"
                tabindex="0"
                checked={checked}
                onClick={onClick}
            />
            <label className="switch-label" for="switch"></label>
        </div>
    )
}

export default Switch
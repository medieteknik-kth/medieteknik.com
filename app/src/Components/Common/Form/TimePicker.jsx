import React from 'react'
import './TimePicker.scss'
import ReactTimePicker from 'react-time-picker'

const TimePicker = ({ onChange, value }) => {
    return (
        <ReactTimePicker
            onChange={onChange}
            value={value}
            format='HH:m'
            clearIcon={null}
            className='time-picker'
        />
    )
}

export default TimePicker

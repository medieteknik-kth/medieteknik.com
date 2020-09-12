import React from 'react'
import './TimePicker.scss'
import ReactTimePicker from 'react-time-picker'
import TimeIcon from './Assets/form-time.png'

const TimePicker = ({ onChange, value }) => {
    return (
        <ReactTimePicker
            onChange={onChange}
            value={value}
            format='HH:mm'
            clearIcon={null}
            clockIcon={<img src={TimeIcon} className='time-icon'/>}
            className='time-picker'
        />
    )
}

export default TimePicker

import React from 'react'
import './DatePicker.scss'
import ReactDatePicker from 'react-date-picker'
import DateIcon from './Assets/form-date.png'

const DatePicker = ({onChange, value, disabled}) => {
    return <ReactDatePicker
        onChange={onChange}
        value={value}
        format='yyyy-MM-dd'
        locale='sv-SE'
        className={`date-picker ${disabled ? 'disabled' : ''}`}
        calendarClassName='date-picker-calendar'
        clearIcon={null}
        calendarIcon={<img src={DateIcon} className='date-icon'/>}
        disabled={disabled}
    />
}

export default DatePicker

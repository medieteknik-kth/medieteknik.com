import React from 'react'
import './DatePicker.scss'
import ReactDatePicker from 'react-date-picker'

const DatePicker = ({onChange, value}) => {
    return <ReactDatePicker
        onChange={onChange}
        value={value}
        format="yyyy-MM-dd"
        locale="sv-SE"
        className="date-picker"
        calendarClassName="date-picker-calendar"
        clearIcon={null}
    />
}

export default DatePicker

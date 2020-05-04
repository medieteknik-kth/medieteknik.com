import React from 'react'
import Select, { components } from 'react-select'

const Dropdown = ({options, onChange}) => {
    const textStyle = {
        fontFamily: 'Roboto',
        fontWeight: 100,
        color: '#909090',
        fontSize: '1.2rem'
    }
    const DropdownIndicator = (
        props
      ) => {
        return (
          <components.DropdownIndicator {...props}>
            <img style={{width: '1.3rem', paddingRight: '0.5rem'}} src='arrow-down.svg'/>
          </components.DropdownIndicator>
        );
    };
    const dropdownStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#e5e5e5' : '#fff',
            padding: '0.8rem',
            paddingLeft: '1.6rem',
            paddingRight: '4rem',
            ...textStyle,
        }),
        indicatorSeparator: () => {},
        control: (provided, state) => ({
            ...provided,
            borderRadius: 0,
            border: 0,
            backgroundColor: '#fff',
            ...textStyle,
            width: '300px',
            highlight: 'none',
            padding: '1rem',
            boxShadow: state.isFocused ? 0 : 0,
            '&:hover': {
               border: state.isFocused ? 0 : 0
            }
        }),
        menu: (provided, state) => ({
            ...provided,
            borderRadius: 0,
            border: 0,
            highlight: 'none',
            boxShadow: 0,
        }),
        menuList: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            border: 0
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#909090',
        }),
        singleValue: (provided) => ({
            ...provided,
            ...textStyle
        }),
        valueController: (provided) => ({
            ...provided,
            border: 0
        }),
      }
      
    return (
        <Select 
            styles={dropdownStyles}
            onChange={onChange}
            defaultValue={options[0]}
            components={{ DropdownIndicator }}
            options={options} />
    );
}

export default Dropdown;
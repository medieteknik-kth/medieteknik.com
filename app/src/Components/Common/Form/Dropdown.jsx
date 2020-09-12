import React from 'react'
import Select, { components } from 'react-select'

const Dropdown = ({options, onChange, defaultValue, isLoading, isDisabled}) => {
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
            <img style={{width: '1.3rem', height: '1.3rem', paddingRight: '0.5rem'}} src='arrow-down.svg' alt=''/>
          </components.DropdownIndicator>
        );
    };
    const dropdownStyles = {
        container: (provided) => ({
            ...provided,
            pointerEvents: 'initial'
        }),
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
            backgroundColor: state.isDisabled ? '#ededed' : '#fff',
            cursor: state.isDisabled ? 'not-allowed' : 'initial',
            ...textStyle,
            highlight: 'none',
            padding: '0.8rem',
            boxShadow: state.isFocused ? 0 : 0,
            '&:hover': {
               border: state.isFocused ? 0 : 0
            },
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
            defaultValue={defaultValue ?? options[0]}
            components={{ DropdownIndicator }}
            options={options}
            isLoading={isLoading}
            isDisabled={isDisabled} />
    );
}

export default Dropdown;
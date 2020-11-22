import React, { useRef, useContext } from 'react';

import classes from './searchField.module.scss';

import {
    LocaleContext,
    translateToString,
} from '../../../Contexts/LocaleContext'

const SearchField = (props) => {
    const searchInput = useRef(null);
    const { lang } = useContext(LocaleContext);

    let searchClass;

    if (props.colorTheme == 'dark') {
        searchClass = classes.darkStyling;
    } else if (props.colorTheme == 'light') {
        searchClass = classes.lightStyling;
    }

    return (
        <input
            className={searchClass}
            type="text"
            ref = {searchInput}
            onKeyUp={() => props.handleSearch(searchInput.current.value)}
            name="name"
            placeholder={translateToString({
                se: props.swedishPlaceholder,
                en: props.englishPlaceholder,
                lang,
            })}
            
        />
    )
}

export default SearchField;

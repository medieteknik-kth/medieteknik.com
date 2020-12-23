import React from 'react';

import classes from './DocumentSideMenu.module.scss';
import SearchField from '../../../Common/SearchField/searchField';

const DocumentSideMenuContent = ({handleSearch}) => {
    return (
        <>
            <SearchField 
                colorTheme = 'dark'
                handleSearch = {handleSearch}
                swedishPlaceholder = 'Sök efter dokument'
                englishPlaceholder = 'Search for documents'
            />
        </>
    )
}

export default DocumentSideMenuContent;
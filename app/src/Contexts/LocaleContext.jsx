import React, { createContext, useState } from 'react';
import LangData from '../Data/language.json'

export const LocaleContext = createContext();

export default function LocaleProvider(props) {
    const LOCAL_STORAGE_ITEM = 'locale';
    const [lang, setLang] = useState( window.localStorage.getItem(LOCAL_STORAGE_ITEM) ?? 'se');
    
    const provider = {
        lang,
        langData: LangData,
        setLocale: (ln) => {
            setLang(ln);
            window.localStorage.setItem(LOCAL_STORAGE_ITEM, ln);
        }
    };

    return (
      <LocaleContext.Provider value={provider}>
        {props.children}
      </LocaleContext.Provider>
    );
  };

export const LocaleText = ({phrase}) => (
    <LocaleContext.Consumer>
        {({ lang, langData }) => {
            const phrases = phrase.split('/').reduce(function(prev, curr) {
                return prev ? prev[curr] : null
            }, langData)
            return phrases ? phrases[lang] : null
        }}
    </LocaleContext.Consumer>
);
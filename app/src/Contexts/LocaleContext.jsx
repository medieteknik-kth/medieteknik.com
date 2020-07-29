import React, { createContext, useState } from 'react';
import LangData from '../Data/language.json'

const DATE_FORMAT ={
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

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

export const translate = ({se, en}) => (
    <LocaleContext.Consumer>
        {({ lang }) => {
            return lang === 'se' ? se : (( en === '' || !en ) ? se : en )
        }}
    </LocaleContext.Consumer>
)

export const translateToString = ({se, en, lang}) => {
    return lang === 'se' ? se : (( en === '' || !en ) ? se : en )
}

// get locale corresponding to the chosen language
// needed for dates to work correctly
export const localeDate = (dateStr) => (
    <LocaleContext.Consumer>
        {({ lang }) => {
            const loc = lang === 'se' ? 'sv-SE': 'en-GB'
            const date = new Date(dateStr)
            return date.toLocaleString(loc, DATE_FORMAT)
        }}
    </LocaleContext.Consumer>
)
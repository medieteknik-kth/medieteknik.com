import React from 'react';
import classes from './scrollableContainer.module.scss';


const ScrollableContainer = ({height, children}) => {
    return (
        <div className={classes.ScrollableContainer} style={{"height": height}}>
            { children }
        </div>
    )
}

export default ScrollableContainer;
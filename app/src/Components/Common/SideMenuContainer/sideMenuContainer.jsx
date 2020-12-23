import React from 'react';
import classes from './sideMenuContainer.module.scss';

const SideMenuContainer = ({ children, extraClasses }) => {
    let sideMenuContainerClasses;

    if (extraClasses !== undefined) {
        sideMenuContainerClasses = [classes.SideMenuContainer, ...extraClasses];
    } else {
        sideMenuContainerClasses = [classes.SideMenuContainer];
    }

     

    sideMenuContainerClasses = sideMenuContainerClasses.join(" ");

    return (
        <div className={sideMenuContainerClasses}>
            { children }
        </div>
    )
}

export default SideMenuContainer;
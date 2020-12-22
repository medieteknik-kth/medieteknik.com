import React from 'react';
import classes from './sideMenuContainer.module.scss';

const SideMenuContainer = ({ children, extraClass }) => {

    let sideMenuContainerClasses = [classes.SideMenuContainer];

    if (extraClass !== undefined) {
        sideMenuContainerClasses.push(extraClass);
    }

    sideMenuContainerClasses = sideMenuContainerClasses.join(" ");

    return (
        <div className={sideMenuContainerClasses}>
            { children }
        </div>
    )
}

export default SideMenuContainer;
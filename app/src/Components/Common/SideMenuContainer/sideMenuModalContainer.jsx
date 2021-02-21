import React, { useEffect, useState } from 'react';
import classes from './sideMenuContainer.module.scss';

const SideMenuContainerModal = ({ children, extraClasses, show, closeModalHandler }) => {
    const [contentHeight, setContentHeight] = useState(200);
    const [contentWidth, setContentWidth] = useState(200);

    let sideMenuContainerClasses;
    let backdropClasses = [classes.backdrop];

    if (extraClasses !== undefined) {
        sideMenuContainerClasses = [classes.SideMenuModalContainer, ...extraClasses];
    } else {
        sideMenuContainerClasses = [classes.SideMenuModalContainer];
    }

    if (show) {
        sideMenuContainerClasses.push(classes.showMenuContent);
        backdropClasses.push(classes.showMenuBackdrop);
    }


    useEffect(() => {
        let style = window.getComputedStyle(document.getElementById("modalContent"), null);
        setContentHeight(parseInt(style.getPropertyValue("height")));
        setContentWidth(parseInt(style.getPropertyValue("width")));
    }, []);

    return (
        <>
            <div className={backdropClasses.join(" ")} onClick={closeModalHandler} />

            <div 
                className={sideMenuContainerClasses.join(" ")} 
                id = "modalContent"
            >
                { children }
            </div>
        </>
    )
}

export default SideMenuContainerModal;
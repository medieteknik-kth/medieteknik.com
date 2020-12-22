import React, { useEffect, useState } from 'react';
import classes from './sideMenuModalContainer.module.scss';

const SideMenuContainerModal = ({ children, extraClasses, show, closeModalHandler }) => {
    const [contentHeight, setContentHeight] = useState(200);
    const [contentWidth, setContentWidth] = useState(200);

    let sideMenuContainerClasses;
    let backdropClasses = [classes.backdrop];

    if (extraClasses !== undefined) {
        sideMenuContainerClasses = [classes.SideMenuContainer, ...extraClasses];
    } else {
        sideMenuContainerClasses = [classes.SideMenuContainer];
    }

    if (show) {
        sideMenuContainerClasses.push(classes.showMenu);
        backdropClasses.push(classes.showMenu);
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
                style={{
                    "marginLeft": `${-contentWidth / 2}px`,
                    "marginTop": `${-contentHeight / 2}px`,
                }}
                id = "modalContent"
            >
                { children }
            </div>
        </>
    )
}

export default SideMenuContainerModal;
import React, { useEffect, useState } from 'react';
import classes from './Spinner.module.css';

const Spinner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 200);
  }, []);

  return (
    <div>
      {visible
        ? <div className={classes.spinnerContainer}><div className={classes.spinner} /></div>
        : <div />}
    </div>

  );
};

export default Spinner;

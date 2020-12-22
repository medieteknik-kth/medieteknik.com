import React, { useState, useEffect, useContext } from 'react';
import styles from './AdminTable.module.scss';

import Table from '../../Common/Table/table';
import Spinner from '../../Common/Spinner/Spinner';

import { translateToString, LocaleContext } from '../../../Contexts/LocaleContext';

export default function AdminTable({ endpoint, fields, idField }) {
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useContext(LocaleContext);

  useEffect(() => {
    endpoint.GetAll().then((responseData) => {
      const filteredData = responseData.map((d) => Object.keys(d)
        .filter((key) => fields.includes(key))
        .reduce((obj, key) => {
          obj[key] = d[key];
          return obj;
        }, {}));

      setData(filteredData);
      setRawData(responseData);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = (o) => {
    const confirmText = translateToString({
      se: 'Är du säker på att du vill ta bort denna?',
      en: 'Are you sure you want to remove this?',
      lang,
    });

    if (window.confirm(confirmText)) {
      const data = rawData.find((v) => Object.keys(o)
        .filter((key) => Object.keys(v).includes(key)) // Includes all keys
        .every((key) => v[key] === o[key])); // Has the same value for each matching key
      const id = data[idField !== undefined ? idField : 'id'];
      endpoint.Delete(id).then((response) => {
        window.location.reload();
      });
    }
  };

  const handleEdit = () => {
  };

  return (
    (isLoading ? <div style={{ width: '100%' }}><Spinner /></div>
      : (
        <div className={styles.adminTableContainer}>
          <Table
            data={data}
            allowRowDelete
            allowRowEdit
            deleteRowHandler={handleDelete}
            editRowHandler={handleEdit}
          />
        </div>
      )
    )
  );
}

import React, { useState, useEffect } from 'react';

import Api from '../../Utility/Api';

export default function PageManager() {
  const [pages, setPages] = useState(null);

  useEffect(() => {
    Api.Pages.GetAll()
      .then((data) => {
        setPages(data);
      });
  }, []);

  return (
    <div>
      { pages !== null
        ? (
          <table>
            <tr>
              <th>id</th>
              <th>Namn</th>
              <th>Senast redigerad</th>
              <th>Antal revideringar</th>
              <th>Status</th>
            </tr>
            {pages.map((page) => (
              <tr>
                <td>{page.id}</td>
                <td>{page.title ? page.title : 'Ingen titel'}</td>
                <td>{page.updated}</td>
                <td>{page.revisions.length}</td>
                <td>{page.published ? 'Publicerad' : 'Avpublicerad'}</td>
              </tr>
            ))}
          </table>
        ) : <div /> }
    </div>

  );
}

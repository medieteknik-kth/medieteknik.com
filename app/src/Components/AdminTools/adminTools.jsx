import React from 'react';
import { Admin, Resource } from 'react-admin';
import { PostCreate, PostList, PostEdit } from './PostAdmin';

import { GetApiObject } from '../../Utility/Api';

const medieteknikApiDataProvider = (type, resource, params) => {
  if (type === 'GET_ONE') {
    return GetApiObject(resource).GetById(params.id).then((data) => Promise.resolve({ data }));
  }

  if (type === 'GET_LIST') {
    let url;
    if (resource === 'pages') {
      url = `${resource}?showUnpublished=true&page=${params.pagination.page}&perPage=${params.pagination.perPage}`;
    } else {
      url = `${resource}?page=${params.pagination.page}&perPage=${params.pagination.perPage}`;
    }

    return GetApiObject(url).GetAllWithFullObject().then((data) => Promise.resolve({
      data: data.data,
      total: data.totalCount,
    }));
  }

  if (type === 'CREATE') {
    return GetApiObject(resource).Create(params.data).then((data) => Promise.resolve({
      data: { id: data.id },
    }));
  }

  if (type === 'UPDATE') {
    return GetApiObject(resource).Update(params.id, params.data).then((data) => Promise.resolve({
      data: { id: data.id },
    }));
  }

  if (type === 'DELETE') {
    return GetApiObject(resource).Delete(params.id).then((data) => Promise.resolve({
      data: { id: data.id },
    }));
  }

  if (type === 'UPDATE_MANY') {
    return Promise.all(params.ids.map((id) => GetApiObject(resource).Update(id, params.data)));
  }

  if (type === 'DELETE_MANY') {
    return Promise.all(params.ids.map((id) => GetApiObject(resource).Delete(id))).then((values) => ({ data: values.map((obj) => obj.id) }));
  }

  if (type === 'GET_MANY') {
    return Promise.all(params.ids.map((id) => GetApiObject(resource).GetById(id))).then((values) => ({ data: values }));
  }

  return Promise.reject();
};

export default function AdminTools() {
  return (
    <Admin dataProvider={medieteknikApiDataProvider} disableTelemetry>
      <Resource name="posts" create={PostCreate} list={PostList} edit={PostEdit} />
      <Resource name="post_tags" />
      <Resource name="committees" />
    </Admin>
  );
}

import { API_BASE_URL, GetApiObject } from '../../Utility/Api';

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

const encodeParams = async (params) => {
  const inputData = {};
  await Promise.all(Object.keys(params.data).map(async (key) => {
    const obj = params.data[key];
    if (typeof obj === 'object' && 'rawFile' in obj) {
      const val = await toBase64(obj.rawFile);
      inputData[key] = val;
    } else {
      inputData[key] = obj;
    }
  }));

  return inputData;
};

export default async (type, resource, params) => {
  console.log(params);
  if (type === 'GET_ONE') {
    if (resource === 'me') {
      const response = await fetch(`${API_BASE_URL}me`, { credentials: 'include' });
      const data = await response.json();
      return { data: { ...data, id: params.id } };
    }

    return GetApiObject(resource).GetById(params.id).then((data) => Promise.resolve({ data }));
  }

  if (type === 'GET_LIST') {
    let filters = new URLSearchParams(params.filter).toString();

    let url;
    if (resource === 'pages') {
      url = `${resource}?showUnpublished=true&page=${params.pagination.page}&perPage=${params.pagination.perPage}&sortBy=${params.sort.field}&orderBy=${params.sort.order}&${filters}`;
    } else {
      url = `${resource}?page=${params.pagination.page}&perPage=${params.pagination.perPage}&sortBy=${params.sort.field}&orderBy=${params.sort.order}&${filters}`;
    }

    return GetApiObject(url).GetAllWithFullObject().then((data) => Promise.resolve({
      data: data.data,
      total: data.totalCount,
    }));
  }

  if (type === 'CREATE') {
    const inputData = await encodeParams(params);
    const data = await GetApiObject(resource).Create(inputData);
    return { data };
  }

  if (type === 'UPDATE') {
    const inputData = await encodeParams(params);
    const data = await GetApiObject(resource).Update(params.id, inputData);
    return {
      data: { id: data.id },
    };
  }

  if (type === 'DELETE') {
    return GetApiObject(resource).Delete(params.id).then((data) => Promise.resolve({
      data: { id: data.id },
    }));
  }

  if (type === 'DELETE_MANY') {
    return Promise.all(params.ids.map((id) => GetApiObject(resource).Delete(id))).then((values) => ({ data: values.map((obj) => obj.id) }));
  }

  if (type === 'GET_MANY') {
    return Promise.all(params.ids.map((id) => GetApiObject(resource).GetById(id))).then((values) => ({ data: values }));
  }

  return Promise.reject();
};

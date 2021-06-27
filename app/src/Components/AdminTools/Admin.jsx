import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Route } from 'react-router-dom';
import { PostCreate, PostList, PostEdit } from './PostAdmin';
import { DocumentCreate, DocumentList, DocumentEdit } from './DocumentAdmin';
import { SelfAdminEdit } from './SelfAdmin';
import { AdminDashboard } from './AdminDashboard';

import AuthProvider from './AuthProvider';
import DataProvider from './DataProvider';
import Login from '../Login/Login';
import AdminLayout from './AdminLayout';

export default function AdminTools() {
  return (
    <Admin
      dataProvider={DataProvider}
      authProvider={AuthProvider}
      // dashboard={AdminDashboard}
      loginPage={Login}
      layout={AdminLayout}
      disableTelemetry
      customRoutes={[
        <Route
          key="profile"
          path="/profile"
          component={SelfAdminEdit}
        />
      ]}
    >
      <Resource name="posts" create={PostCreate} list={PostList} edit={PostEdit} />
      <Resource name="post_tags" />
      <Resource name="committees" />
      <Resource name="documents" create={DocumentCreate} list={DocumentList} edit={DocumentEdit} />
      <Resource name="document_tags" />
      <Resource name="me" />
    </Admin>
  );
}

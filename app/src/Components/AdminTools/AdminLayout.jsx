import React from "react";
import { Layout, AppBar } from 'react-admin';

const AdminAppBar = props => (
  <AppBar {...props} position="absolute" />
);

export default props => <Layout
  {...props}
  appBar={AdminAppBar}
/>;
import React from 'react';
import {
  List, Datagrid, TextField, SimpleForm, TextInput, Edit,
} from 'react-admin';

export function CommitteeList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="name" />
      </Datagrid>
    </List>
  );
}

export function CommitteeEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  );
}

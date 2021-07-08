import React from 'react';
import {
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  Edit,
  List,
  ReferenceInput,
  required, SelectInput,
  SimpleForm, TextField,
  AutocompleteInput,
  DateInput,
  Filter
} from 'react-admin';

export const OfficialsFilter = (props) => (
  <Filter {...props}>
    <BooleanInput label="Visa bara nuvarande funktionärer" source="isCurrent" alwaysOn />
  </Filter>
);

export function OfficialCreate(props) {
  return (<Create {...props}>
    <SimpleForm>
      <ReferenceInput label="Post" source="post.id" reference="committee_posts" validate={[required()]} perPage={10000}>
        <SelectInput source="postId" optionText="name" />
      </ReferenceInput>
      <ReferenceInput label="Person" source="user.id" reference="users" validate={[required()]} perPage={10000}>
        <AutocompleteInput optionText={(user) => `${user.firstName} ${user.lastName}`} />
      </ReferenceInput>
      <DateInput source="startDate" />
      <DateInput source="endDate" />
    </SimpleForm>
  </Create>);
}

export function OfficialList(props) {
  return (
    <List {...props} /*filters={<OfficialsFilter />}*/>
      <Datagrid rowClick="edit">
        <TextField source="post.name" label="Post" />
        <TextField source="user.firstName" label="Förnamn" />
        <TextField source="user.lastName" label="Efternamn" />
        <DateField source="startDate" label="Start" />
        <DateField source="endDate" label="Slut" />
      </Datagrid>
    </List>
  );
}

export function OfficialEdit(props) {
  return (<Edit {...props}>
    <SimpleForm>
      <ReferenceInput label="Post" source="post.id" reference="committee_posts" validate={[required()]} perPage={10000}>
        <SelectInput source="postId" optionText="name" />
      </ReferenceInput>
      <ReferenceInput label="Person" source="user.id" reference="users" validate={[required()]} perPage={10000}>
        <AutocompleteInput optionText={(user) => `${user.firstName} ${user.lastName}`} />
      </ReferenceInput>
      <DateInput source="startDate" />
      <DateInput source="endDate" />
    </SimpleForm>
  </Edit>);
}

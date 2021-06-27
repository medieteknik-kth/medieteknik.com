import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SimpleForm,
  TextInput,
  Edit,
  Create,
  required,
  DateField,
  DateInput,
  TranslatableInputs,
  FileInput,
  FileField, SelectArrayInput, ReferenceArrayInput, ImageField
} from 'react-admin';
import DeltaEditor from "./DeltaEditor";

export function DocumentCreate(props) {
  return (
    <Create {...props}>
      <SimpleForm>
        <TranslatableInputs locales={['se', 'en']} defaultLocale="se">
          <TextInput source="title" validate={[required()]} />
        </TranslatableInputs>
        <DateInput source="date" label="Datum" validate={[required()]} />
        <ReferenceArrayInput source="tags" reference="document_tags">
          <SelectArrayInput optionValue="id" optionText="title.se" />
        </ReferenceArrayInput>
        <FileInput source="file" label="Dokument" accept="application/pdf">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
}

export function DocumentList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="title.se" label="Namn (se)" />
        <TextField source="title.en" label="Namn (en)" />
        <DateField source="date" label="Datum" />
      </Datagrid>
    </List>
  );
}

export function DocumentEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TranslatableInputs locales={['se', 'en']} defaultLocale="se">
          <TextInput source="title" validate={[required()]} />
        </TranslatableInputs>
        <DateInput source="date" label="Datum" validate={[required()]} />
        <ReferenceArrayInput source="tags" reference="document_tags">
          <SelectArrayInput optionValue="id" optionText="title.se" />
        </ReferenceArrayInput>
        <ImageField source="thumbnail" />
      </SimpleForm>
    </Edit>
  );
}

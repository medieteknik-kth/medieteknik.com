import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SimpleForm,
  TextInput,
  Edit,
  Create,
  ImageInput,
  BooleanInput,
  FormDataConsumer,
  DateTimeInput,
  ReferenceArrayInput,
  SelectArrayInput,
  TranslatableInputs,
  ReferenceInput,
  SelectInput,
  required,
  ImageField,
  DateField,
} from 'react-admin';
import DeltaEditor from './DeltaEditor';

export function PostCreate(props) {
  return (
    <Create {...props}>
      <SimpleForm>
        <TranslatableInputs locales={['se', 'en']} defaultLocale="se">
          <TextInput source="title" validate={[required()]} />
          <DeltaEditor source="body" validate={[required()]} />
        </TranslatableInputs>
        <ImageInput source="header_image" label="Omslagsbild" accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
        <ReferenceInput source="committee_id" reference="committees">
          <SelectInput source="committee" optionValue="id" optionText="name" />
        </ReferenceInput>
        <ReferenceArrayInput source="tags" reference="post_tags">
          <SelectArrayInput optionValue="id" optionText="title" />
        </ReferenceArrayInput>
        <BooleanInput source="scheduled" label="Schemalägg publicering" />
        <FormDataConsumer>
          {({ formData, ...rest }) => formData.scheduled && (
          <DateTimeInput
            source="publishedAt"
            label="Schemalagd till"
            validate={(date) => Date.now() < date}
          />
          )}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
}

export function PostList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="title.se" label="Rubrik (se)" />
        <TextField source="title.se" label="Rubrik (en)" />
        <DateField source="date" showTime label="Skapad" />
      </Datagrid>
    </List>
  );
}

export function PostEdit(props) {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TranslatableInputs locales={['se', 'en']} defaultLocale="se">
          <TextInput source="title" validate={[required()]} />
          <DeltaEditor source="body" validate={[required()]} />
        </TranslatableInputs>
        <ImageField source="header_image" label="Nuvarande omslagsbild" />
        <ImageInput source="header_image" label="Ny omslagsbild" accept="image/*">
          <ImageField source="src" />
        </ImageInput>
        <ReferenceInput source="committee_id" reference="committees">
          <SelectInput source="committee" optionValue="id" optionText="name" />
        </ReferenceInput>
        <ReferenceArrayInput source="tags" reference="post_tags">
          <SelectArrayInput optionValue="id" optionText="title" />
        </ReferenceArrayInput>
        <BooleanInput source="scheduled" label="Schemalägg publicering" />
        <FormDataConsumer>
          {({ formData, ...rest }) => formData.scheduled && (
          <DateTimeInput
            source="publishedAt"
            label="Schemalagd till"
            validate={(date) => Date.now() < date}
          />
          )}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
}

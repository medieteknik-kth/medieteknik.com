import React from 'react';
import {
  SimpleForm,
  TextInput,
  Edit,
  ImageInput,
  BooleanInput,
  required,
  ImageField,
} from 'react-admin';
import { translate } from '../../Contexts/LocaleContext';

export function SelfAdminEdit(props) {
  return (
    <Edit
      id="1"
      resource="me"
      basePath="/profile"
      title="Profile"
      {...props}
    >
      <SimpleForm>
        <TextInput source="firstName" validate={[required()]} label={translate({se: "Förnamn", en: "First name"})} />
        <TextInput source="lastName" validate={[required()]} label={translate({se: "Efternamn", en: "Last name"})} />
        <TextInput source="frackName" label={translate({se: "Fracknamn", en: "Tail coat name"})} />

        <TextInput source="facebook" />
        <TextInput source="linkedin" />

        <BooleanInput source="alumni" />

        <ImageField source="profilePicture" label={translate({se: "Nuvarande profilbild", en: "Current profile picture"})} />
        <ImageInput source="profilePicture" label={translate({se: "Ny profilbild", en: "New profile picture"})} accept="image/*">
          <ImageField source="src" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
}

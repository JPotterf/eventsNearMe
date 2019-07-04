import React from "react";
import { Form, Label } from "semantic-ui-react";

//creates a reusable component for Redux form
const TextInput = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error }
}) => {
  return (
    //error check converts error object from ReduxForms to bool
    //if error exists shade field and pass error object
    <Form.Field error={touched && !!error}>
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <Label basic color='red'>{error}</Label>}
    </Form.Field>
  );
};

export default TextInput;

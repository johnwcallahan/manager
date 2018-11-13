# Form Validation

Use the `EnhancedValidation` HOC to add validation to a form. This HOC wraps around Formik, a popular library for implementing validation on React forms. For more info on Formik, see the documentation here: https://jaredpalmer.com/formik/docs/overview

## Adding form validation to a component

1) Import the HOC and props into the file:

```typescript
import withEnhancedValidation, { EnhancedValidationProps } from 'src/components/EnhancedValidation';
```

2) Define a `mapPropsToValues` function. This corresponds to the Formik function of the same name. This maps a component's props to the initial form values.

```typescript
const mapPropsToValues = (props: Props) => ({
  label: props.linodeLabel
});
```

3) Define a `validationSchema` object. This can be also be a function, but a Yup schema object is preferable

```typescript
const validationSchema = object().shape({
  label: string()
    .required('Label is required')
    .matches(/^((?!--|__).)*$/, 'Label must not include two dashes or underscores in a row')
    .matches(/^[a-zA-Z0-9].+[a-zA-Z0-9]$/, 'Label must begin and end with a letter or number')
});
```

4) Define a `successMessage` string, which is to be displayed after successful validation.

```typescript
const successMessage = 'Linode label changed successfully.';
```

5) Define a `request` function, which is the function to be called on form submission. Note that you have access to all of the components props as the `ownProps` argument.

```typescript
const request = (ownProps: any) => updateLinode(
  ownProps.linodeId,
  { label: ownProps.values.label }
);
```

6) Wrap up component in the HOC with the values you've just defined as arguments.

```typescript
const validated = withEnhancedValidation(
  mapPropsToValues,
  validationSchema,
  request,
  successMessage
)(LinodeSettingsLabelPanel);
```

Now, from inside your main component, you have access to `withFormik` props (see documentation) and `EnhancedValidation` props. You can use these according to your form's needs. E.g. for a form submission button:

```typescript
<Button
  onClick={props.handleFormSubmission}
  disabled={props.isSubmitting}
  loading={props.isSubmitting}
>
```

Or a text field:

```typescript
<TextField
  label="Label"
  name="label"
  value={props.values.label}
  onChange={props.handleTextFieldChange}
  onBlur={props.handleBlur}
  errorText={props.maybeGetErrorText('label')}
/>
```

### IMPORTANT
There are a few things to remember when using these props in your component:

- Give each field a `name` attribute, with the value you set up in `mapPropsToValues`.
- The value of a field should be `props.values.<FIELD_NAME>`
- The `onChange` attribute should be `props.handleTextFieldChange` or `props.handleSelectFieldChange`, etc. - The `onBlur` attribute should be `props.handleBlur`.
- You can define error text with `props.maybeGetErrorText(<FIELD_NAME>)`.
- Can can use the `status` prop to access validation status as well as the success or error message (see Formik docs). E.g. `success={status.success && status.message}`.







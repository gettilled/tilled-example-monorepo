async function injectFields(fieldsObject, form) {
  const fieldOptions = {
    styles: {
      base: {
        fontFamily:
          '-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        color: "#304166",
        fontWeight: "400",
        fontSize: "16px",
      },
      invalid: {
        ":hover": {
          textDecoration: "underline dotted red",
        },
        color: "#777777",
      },
      valid: {
        color: "#32CD32",
      },
    },
  };

  Object.entries(fieldsObject).forEach((entry) => {
    const [field, fieldElement] = entry;
    // set placeholder for cardExpiry
    fieldOptions.placeholder = field === 'cardExpiry' ? 'MM/YY' : undefined;
    form.createField(field, fieldOptions).inject(fieldElement);
  });
}

export default injectFields;

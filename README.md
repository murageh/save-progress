# save-progress

Recently, I was working on a project that required a lot of data entry. 
The form was long, and the user had to enter a lot of data. 
I wanted to make sure that the user's progress was saved, so that they could come back to the form later, 
and continue where they left off.

I looked for a solution, but I couldn't find anything that suited my needs. And so, I decided to create my own solution. 

That's how this module was born. It is a simple hook that allows you to save 
the progress of a form, or any other data, to the local storage of the browser. It is useful for long forms, or forms that require a lot of data entry.... Or anything, really. It's up to you.

## Installation

```bash
npm install @crispice/save-progress
```

## Usage

### useSaveProgress hook

```typescript jsx
import { useSaveProgress } from "@crispice/save-progress";

const MyFormComponent = () => {
    const [values, updateValues, deleteValues] = useSaveProgress({key: 'user-form'}); 
    
    // you can also pass a second argument to the hook to set the initial values
    // const [values, updateValues, deleteValues] = useSaveProgress({key: 'user-form', initialValues: {name: '', email: ''}});
    
    const handleChange = (e) => {
        const newValue = e.target.value;
        updateValues((prevValues) => ({...prevValues, [e.target.name]: newValue}));
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // do something with the values
        deleteValues();
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={values.name ?? ''} onChange={handleChange} />
            <input type="text" name="email" value={values.email ?? ''} onChange={handleChange} />
            <input type="submit" value="Submit" onSubmit={handleSubmit} />
        </form>
    )
}

```

### The AutoSaveForm component

This component is designed to be used inside a Formik form. It only takes one prop, which is the saveFunction. You can pass any function to this prop, but it was designed to use the `updateValues` function returned by the `useSaveProgress` hook.

It is primarily a passive component, and does not have any UI elements.

It is up to you to create the form and handle the submit event. After submitting the form, it is advised that you reset the form values (using Formik's reset method, or any other way you see fit).
Once your form is reset, the values will be cleared from the local storage as well. Failure to do so will result in the values not bei cleared from the local storage, and will be reloaded the next time the form is loaded.

Please note that this component does not handle the form submission. It is up to you to handle the submission of the form, and to clear the form values after submission.

Also note that using this component outside a Formik context will result in a warning, or an error.

```typescript jsx

import { AutoSaveForm } from "@crispice/save-progress";
import { Formik, Form, Field } from 'formik';

const MyFormComponent = () => {
    const [values, updateValues, _] = useSaveProgress({key: 'user-form', initialValues: {name: ''}});

    const handleChange = (e) => {
       // do something with the values
    }
    const handleSubmit = (values) => {
        // do something with the values
    }
    
    return (
        <Formik
            initialValues={values}
            validate={values => {
                const errors = {};
                if (values.name.length < 1) {
                    errors.token = 'Enter a name.';
                }
                return errors;
            }}
            onSubmit={(values, actions, resetForm) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                    // call Formik's reset method. This will clear the form values, and will also clear the values from the local storage.
                    resetForm({ values: { name: '' } });
                }, 1000);
            }}
        >
            <Form>
                <Field name="name" type="text" />
                <AutoSubmitToken />
            </Form>
        </Formik>
    )
}

```

---
Made with ❤️ by [MURAGEH](https://github.com/murageh) and [CRISP-ICE TECHNOLOGIES](https://crispice.netlify.app)

## License

MIT

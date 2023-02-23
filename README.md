# useProgress

#### Your progressive form lifesaver (No pun intended... or was it?). Save your form's progress without hassle.

Ever worked on a form that was too long, and you had to stop halfway through, only to forget where you stopped?
Or maybe you had to close the browser, and you had to start all over again? Well, this package was designed for you.

This package allows you to save the progress of your form, and reload it later. It is designed to work with any form,
and does not have any UI elements. It is up to you to create the form, and handle the submit event.

## Features
1. Save the progress of your form to the local storage, or to the session storage.
2. Reload the values from the local storage, or from the session storage.
3. Clear the values from the local storage, or from the session storage.
    
    ```You can choose where to save the values. You can either save them to the local storage, or to the session storage.```

4. You can define your own save and clear functions. This is useful if you want to save the values to a database, or to a server, and probably clear them later.
5. If you use TypeScript, or you like strict typing, you can explicitly declare the type of data the hook will accept and return. This is useful if you want to
have stricter control over your data. If you fear Types, feel free to pass `<any>` as the type. Don't tell anyone I said that. 😀
6. You can maintain the default behavior while still carrying out your custom logic.
7. You can use the hook on its, or with the AutoSaveForm component. The AutoSaveForm component is designed to be
used inside a Formik form, and will handle the repetitive tasks of saving the data for you. 
Just plug in your save function, and you are good to go. Come back later ,and your form will be saved.


Awesome, right? Well, let's get started.

## Installation

If you are using npm:

```bash
npm install @crispice/save-progress
```

For yarn users:

```bash
yarn add @crispice/save-progress
```

## Usage

## The `useProgress` hook

- The hook takes an object as an argument. The object must have a `key` property, which is a string.
The key is used to identify the data in the local or session storage. It is recommended that you use a unique key for each form.
- The hook returns an array with three items. The first item is the values object, which contains the saved values.
The second item is the updateValues function, which is used to update the values in the local storage.
The third item is the deleteValues function, which is used to delete the values from storage.

- The hook also takes an optional second argument, which is an object containing the initial values.
If you pass this argument, the values will be set to the initial values, and will be saved to the local storage.
If you do not pass this argument, the values will be set to an empty object, and will be saved to the local storage.

The hook will also return the values from the local storage if they exist. If they do not exist, it will return the
initial values, or an empty object if no initial values were passed.

> Update (23/02/2023): 
> 1. You can choose where to save the values. You can either save them to the local storage, or to the session storage.
> To do this, pass a `storage` property to the object passed to the hook. The value of this property should be either
> `localStorage` or `sessionStorage`. If you do not pass this property, the values will be saved to the local storage.
> 
> 2. We renamed the hook to `useProgress`. However, you can still `useSaveProgress` if you prefer, to maintain backwards compatibility.
> 3. We added optional `saveFunction` and `clearFunction` props. 
>    - These functions are supposed to be used in the case that you need to define your 
>    own save and clear functions. This is useful if you want to save the values to a database, or to a server, and probably clear them later. The functions will be called
>    every time the values are updated, or cleared, respectively. 
>    - The functions will be passed the values as an argument. Please note that this will short 
>    circuit the storage of the values in the local storage. 
>    - If you want to maintain the default behavior while still carrying out your custom logic,
>    set optional argument, `forceLocalActions = true`, or carry them inside your custom logic.
> 4. If you use TypeScript, or you like strict typing, you can explicitly declare the type of data the hook will accept and return. This is useful if you want to
> have stricter control over your data. 
> For example:
> ```typescript jsx
> const [values, updateValues, deleteValues] = useProgress<{name: string, email: string}>({key: 'user-form'});
> ```


### Example
```typescript jsx
import {useProgress} from "@crispice/save-progress";

const MyFormComponent = () => {
    const [values, updateValues, deleteValues] = useProgress({key: 'user-form'});

    // or
    const [values, updateValues, deleteValues] = useProgress({
        key: 'user-form',
        initialValues: {name: '', email: ''},
        // you can select where to save. Accepts localStorage or sessionStorage
        storage: sessionStorage,
        // this saveFunction overrides the default behavior
        saveFunction: (values) => {
            console.log('Saving values', values);
            sessionStorage.setItem('my-key', JSON.stringify(values));
        },
        clearFunction: (optionalArgument) => {
            console.log('Clearing values', optionalArgument);
            sessionStorage.removeItem('my-key');
        },
        // passing this forceLocalSave property maintains the default behavior, but also carries out your custom save logic.
        forceLocalSave: false,
    });

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
            <input type="text" name="name" value={values.name ?? ''} onChange={handleChange}/>
            <input type="text" name="email" value={values.email ?? ''} onChange={handleChange}/>
            <input type="submit" value="Submit" onSubmit={handleSubmit}/>
        </form>
    )
}

```

## The AutoSaveForm component

This component is designed to be used inside a Formik form. It only takes one prop, which is `saveFunction`. You can
pass any function to this prop, but it was designed to use the `updateValues` function returned by the `useProgress`
hook.

It is primarily a passive component, and does not have any UI elements.

It is up to you to create the form and handle the submit event. After submitting the form, it is advised that you reset
the form values (using Formik's reset method, or any other way you see fit).
- Once your form is reset, the values will be cleared from the local storage as well. Failure to do so will result in the values not being cleared from the local storage, and will be reloaded the next time the form is loaded.

*Note that using this component outside a Formik context will result in a warning, or most likely, an error.*

#### Example
```typescript jsx

import {AutoSaveForm, useProgress} from "@crispice/save-progress";
import {Formik, Form, Field} from 'formik';

const MyFormComponent = () => {
    const [values, updateValues, _] = useProgress({key: 'user-form', initialValues: {name: ''}});

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
                    // call Formik's reset method. This will clear the form values, 
                    // and will also clear the values from the local storage.
                    resetForm({values: {name: ''}});
                }, 1000);
            }}
        >
            <Form>
                <Field name="name" type="text"/>
                <AutoSaveForm saveFunction={updateValues}/>
            </Form>
        </Formik>
    )
}

```

---
Made with ❤️ by [MURAGEH](https://github.com/murageh) and [CRISP-ICE TECHNOLOGIES](https://crispice.netlify.app)

## License

MIT

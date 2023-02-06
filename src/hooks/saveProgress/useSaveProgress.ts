import React from 'react';

/**
 * This is a custom hook that is used to save the progress of the user's input,
 * for instance, if the user is filling out a form, and they leave the page,
 * the next time they come back, the form will be filled out with the data
 * they had previously entered.
 *
 *
 * Typical usage:
 * Use this hook to save the progress of the user's input, for instance, if the user is filling out a form, and they leave the page,
 * the next time they come back, the form will be filled out with the data they had previously entered.
 *
 * The {@link AutoSaveForm} component is a helper component that will automatically save the data to local storage when the form is submitted.
 * The {@link AutoSaveForm} requires a saveFunction prop, which is the updateValues function returned by this hook.
 *
 * @param key The key to use to save the data in local storage
 * @param initialValue The initial value to use if there is no data in local storage
 *
 * @returns [values, updateValues, clearValues] The data, a function to update the data, and a function to clear the data
 */
const useSaveProgress = ({key, initialValues, storage}: { key: string, initialValues?: any, storage?: Storage }) => {
    const [values, setValues] = React.useState(() => {
        const saved = localStorage.getItem(key);
        const initialValue = JSON.parse(saved!);
        return initialValue || initialValues || {};
    });

    // default to local storage
    if (!storage) {
        storage = localStorage;
    }

    // Helper function to save the data to local storage
    const saveValues = (value: any) => {
        storage?.setItem(key, JSON.stringify(value));
    };

    // Provide helper function to clear the data from local storage
    const clearValues = () => {
        setValues(initialValues || {});
        storage?.removeItem(key);
    };

    // Provide helper function to update the data in local storage
    function updateValues(value: any) {
        setValues(value);
        saveValues(value);
    }

    return [values, updateValues, clearValues];
};

export default useSaveProgress;
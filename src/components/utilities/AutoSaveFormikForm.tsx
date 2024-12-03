import {useFormikContext} from 'formik';
import React from 'react';
import {useProgressProps} from "../../hooks/saveProgress/useProgress";
import {useFormProgress} from "../../hooks";

export interface AutoSaveFormProps<T extends {}> extends useProgressProps<T> {
    children?: React.ReactNode | Element;
}

/**
 * This component is a wrapper for the `useFormProgress` custom hook.
 * It is used to save the form data when the user changes the form data.
 * This is useful for forms that are long, and the user may not want to click the save button.
 *
 * Note: This requires a valid Formik context.
 * Thus, this component will only work if there is a parent Formik React Context from which it can pull from.
 * If called without a parent context (i.e., a descendant of a `<Formik>` component or `withFormik` higher-order component),
 * you will get a warning in your console.
 * For more details regarding this, visit the [Formik documentation](https://formik.org/docs/api/useFormikContext).
 *
 * Note: The `values` from Formik will be prioritized over `initialValues`.
 *
 * @template T - The type of the form values.
 * @param {AutoSaveFormProps<T>} props - The properties for the component.
 * @param {string} props.dataKey - The dataKey to identify the stored values.
 * @param {T} [props.initialValues] - The initial values for the form.
 * @param {Storage} [props.storage] - The storage to use (localStorage or sessionStorage). Defaults to localStorage.
 * @param {(values: T) => void} [props.saveFunction] - Custom function to save values. If provided, this will be used instead of the storage.
 * @param {(values?: T) => void} [props.clearFunction] - Custom function to clear values. Crucial for custom save functions.
 * @param {boolean} [props.forceLocalActions] - Whether to force local storage actions even if custom functions are provided. Could be useful for debugging.
 * @param {React.ReactNode} [props.children] - The children of the form.
 * @returns {React.ReactNode} - Returns the children or null.
 */
const AutoSaveFormikForm = React.memo(
    function AutoSaveFormikForm<T extends {}>(props: AutoSaveFormProps<T>) {
        const { values, setValues } = useFormikContext<T>();
        const { dataKey, storage = localStorage, saveFunction, clearFunction, forceLocalActions, children } = props;
        const [_, updateValues] = useFormProgress<T>({
            dataKey: dataKey,
            initialValues: values, // Prioritize Formik values
            storage,
            saveFunction,
            clearFunction,
            forceLocalActions,
        });

        React.useEffect(() => {
            const savedValues = storage.getItem(dataKey);
            if (savedValues) {
                const parsedValues = JSON.parse(savedValues);
                setValues((prevValues) => ({ ...prevValues, ...parsedValues }));
            }
        }, [dataKey, setValues, storage]);

        const memoizedUpdateValues = React.useCallback(() => {
            try {
                updateValues(values);
            } catch (error) {
                console.warn("Error saving form data. Please check the save function. If the error persists, please contact the developer.");
                console.log(error);
            }
        }, [values, updateValues]);

        React.useEffect(() => {
            memoizedUpdateValues();
        }, [memoizedUpdateValues]);

        return <>{children || null}</>;
    });

/**
 * @deprecated Use {@link AutoSaveFormikForm} instead.
 * The naming was unclear regarding the Formik context,
 * so this function was renamed to {@link AutoSaveFormikForm}.
 * This function may be removed in the next major release.
 */
export const AutoSaveForm = AutoSaveFormikForm;

export default AutoSaveFormikForm;

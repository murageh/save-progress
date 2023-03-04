import React from 'react';

export interface useProgressProps<T extends {}> {
    key: string;
    initialValues?: T;
    storage?: Storage;
    saveFunction?: (values: T) => void;
    clearFunction?: (values?: T) => void;
    forceLocalActions?: boolean;
}

/**
 * If you are using `useSaveProgress`, please migrate to `useProgress` instead.
 *
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
 * The {@link AutoSaveForm} component is a helper component that will automatically save the data when the form is submitted.
 * The {@link AutoSaveForm} requires a saveFunction prop, which is the setValues function returned by this hook, or any other function.
 *
 * @param key The key to use to save the data in local storage
 * @param initialValue The initial value to use if there is no data in local storage
 * @param storage The storage to use, defaults to local storage
 * @param saveFunction A function to save the data to a server. If this is provided, the data will not be saved locally. You can use this function to customize the save logic.
 * @param clearFunction A function to clear the data from a server. If this is provided, the data will not be cleared locally. You can use this function to customize the clear logic.
 * @param forceLocalActions If true, the data will be saved locally even if a saveFunction is provided. This is useful if you want to save the data locally, in addition to saving it to a server. This also applies to the clearFunction
 *
 * @returns [values, setValues, clearValues] The data, a function to update the data, and a function to clear the data
 */
function useProgress<T extends {}>({
                                       key,
                                       initialValues = {} as T,
                                       storage,
                                       saveFunction,
                                       clearFunction,
                                       forceLocalActions = false
                                   }: useProgressProps<T>) {
    const [initialized, setInitialized] = React.useState(false);
    const [values, setValues] = React.useState(initialValues);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = (storage ?? window.localStorage).getItem(key);
            let initialValue: T;
            try {
                initialValue = JSON.parse(saved!);
            } catch (e) {
                initialValue = {} as T;
            }
            setValues(initialValue || initialValues || {} as T);
            saveValues(values);
            setInitialized(true);
        }
    }, []);

    React.useEffect(() => {
        if (!initialized) return;
        saveValues(values);
    }, [values]);

    // Helper function to save the data to local storage
    const saveValues = (values: T) => {
        if (saveFunction) {
            saveFunction(values);
            if (!forceLocalActions) return;
        }
        if (typeof window !== 'undefined') {
            (storage ?? window.localStorage).setItem(key, JSON.stringify(values));
        }
    };

    // Provide helper function to clear the data from local storage
    const clearValues = () => {
        setValues(initialValues);
        if (clearFunction) {
            clearFunction(values);
            if (!forceLocalActions) return;
        }
        if (typeof window !== 'undefined') {
            (storage ?? window.localStorage).removeItem(key);
        }
    };

    return [values, setValues, clearValues] as const;
}

export default useProgress;

/**
 * @deprecated Use the {@link useProgress} hook instead.
 */
export const useSaveProgress = useProgress;
import React from 'react';

export interface useProgressProps<T extends {}> {
    dataKey: string;
    initialValues?: T;
    storage?: Storage;
    saveFunction?: (values: T) => void;
    clearFunction?: (values?: T) => void;
    forceLocalActions?: boolean;
    fetchInitialValues?: () => Promise<T>;
}

/**
 * Custom hook to save and manage the progress of user input, such as form data.
 * This hook ensures that user input is preserved even if the user navigates away from the page.
 *
 * @template T - The type of the form values.
 * @param {Object} props - The properties for the hook.
 * @param {string} props.dataKey - The dataKey to identify the stored values.
 * @param {T} [props.initialValues] - The initial values for the form.
 * @param {Storage} [props.storage] - The storage to use (localStorage or sessionStorage). Defaults to localStorage.
 * @param {(values: T) => void} [props.saveFunction] - Custom function to save values. If provided, this will be used instead of the storage.
 * @param {(values?: T) => void} [props.clearFunction] - Custom function to clear values. Crucial for custom save functions.
 * @param {boolean} [props.forceLocalActions] - Whether to force local storage actions even if custom functions are provided. Could be useful for debugging.
 * @param {() => Promise<T>} [props.fetchInitialValues] - Function to fetch initial values asynchronously. Values from this function will override the storage values.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>, () => void]} - Returns the current values, a function to update the values, and a function to clear the values.
 * */
function useFormProgress<T extends {}>({
                                           dataKey,
                                           initialValues = {} as T,
                                           storage,
                                           saveFunction,
                                           clearFunction,
                                           forceLocalActions = false,
                                           fetchInitialValues,
                                       }: useProgressProps<T>) {
    const [initialized, setInitialized] = React.useState(false);
    const [values, setValues] = React.useState(initialValues);

    React.useEffect(() => {
        const initializeValues = async () => {
            let initialValue: T = initialValues;

            if (fetchInitialValues) {
                try {
                    initialValue = await fetchInitialValues();
                } catch (e) {
                    console.error('Failed to fetch initial values:', e);
                }
            } else if (typeof window !== 'undefined') {
                const saved = (storage ?? window.localStorage).getItem(dataKey);
                try {
                    initialValue = JSON.parse(saved!);
                } catch (e) {
                    initialValue = {} as T;
                }
            }

            setValues(initialValue || initialValues || {} as T);
            saveValues(initialValue);
            setInitialized(true);
        };

        void initializeValues();
    }, []);

    React.useEffect(() => {
        if (!initialized) return;
        saveValues(values);
    }, [values]);

    const saveValues = (values: T) => {
        if (saveFunction) {
            saveFunction(values);
            if (!forceLocalActions) return;
        }
        if (typeof window !== 'undefined') {
            (storage ?? window.localStorage).setItem(dataKey, JSON.stringify(values));
        }
    };

    const clearValues = () => {
        setValues(initialValues);
        if (clearFunction) {
            clearFunction(values);
            if (!forceLocalActions) return;
        }
        if (typeof window !== 'undefined') {
            (storage ?? window.localStorage).removeItem(dataKey);
        }
    };

    return [values, setValues, clearValues] as const;
}

export default useFormProgress;

/**
 * @deprecated Use the {@link useProgress} hook instead.
 */
export const useProgress = useFormProgress;

/**
 * @deprecated Use the {@link useProgress} hook instead.
 * This will be removed in the next major version.
 */
export const useSaveProgress = useFormProgress;
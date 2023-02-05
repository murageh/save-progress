import {useFormikContext} from 'formik';
import React from 'react';

export interface AutoSaveFormProps {
    saveFunction: any;
}

/**
 * This widget is a wrapper for the {@link useSaveProgress} custom hook. It is used to save the form data when the user changes the form data.
 * This is useful for forms that are long and the user may not want to click the save button.
 * @param props.saveFunction This is the function that will be called when the user changes the form data. This function should save the form data.
 * @returns {null}
 */
const AutoSaveForm = (props: AutoSaveFormProps) => {
    const {saveFunction} = props;

    // Grab values from formik context
    const {values} = useFormikContext();

    // Save the form data when the user changes the form data.
    React.useEffect(() => {
        try {
            saveFunction(values);
        } catch (error) {
            console.log(error);
        }
    }, [values]);

    return null;
};

export default AutoSaveForm;

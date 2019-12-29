import React, { useEffect, useRef } from 'react';
import './Input.css';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Formik, Form, Field } from 'formik';

import { Entry, generateUserEntry } from '../utils';

const Input: React.FC<{
    onNewEntry: (entry: Entry) => void;
    textAreaSize: number;
}> = props => {
    let inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
    useEffect(() => {
        if (inputRef.current instanceof HTMLTextAreaElement) {
            inputRef.current.focus();
        }
    });
    return (
        <Formik
            initialValues={{ input: '' }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                resetForm();
                setTimeout(() => {
                    props.onNewEntry(generateUserEntry(values.input.trim()));
                    setSubmitting(false);
                }, 50);
            }}
            render={formikProps => {
                return (
                    <Form
                        onKeyDown={e => {
                            if (e.keyCode === 13 && !e.shiftKey) {
                                e.preventDefault();
                                formikProps.submitForm();
                            }
                        }}
                    >
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>>></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                as={Field}
                                innerRef={ref => {
                                    inputRef = {
                                        current: ref as HTMLTextAreaElement,
                                    };
                                }}
                                style={{
                                    height: `${0.8 * props.textAreaSize}vh`,
                                }}
                                component="textarea"
                                name="input"
                                autoComplete="off"
                            />
                        </InputGroup>
                    </Form>
                );
            }}
        />
    );
};

export default Input;

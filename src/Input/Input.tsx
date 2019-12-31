import React, { useEffect, useRef, useState, Dispatch } from 'react';
import './Input.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Formik, Form, Field } from 'formik';

import { Entry, generateUserEntry, LinkedList, LinkedItem } from '../utils';

type InputProps = {
    userEntries: LinkedList<Entry>;
    onNewEntry: (entry: Entry) => void;
    textAreaSize: number;
};

const Input: React.FC<InputProps> = ({
    userEntries,
    onNewEntry,
    textAreaSize,
}) => {
    let inputRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
    useEffect(() => {
        if (inputRef.current instanceof HTMLTextAreaElement) {
            inputRef.current.focus();
        }
    });

    const [currentEntry, setCurrentEntry]: [
        LinkedItem<Entry>,
        Dispatch<any>
    ] = useState(
        userEntries.prepend(generateUserEntry('')).head as LinkedItem<Entry>
    );
    useEffect(
        () =>
            setCurrentEntry(
                userEntries.prepend(generateUserEntry('')).head as LinkedItem<
                    Entry
                >
            ),
        [userEntries]
    );

    return (
        <Formik
            initialValues={{ input: currentEntry.value.text }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                resetForm();
                setTimeout(() => {
                    onNewEntry(generateUserEntry(values.input.trim()));
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
                            if (e.keyCode === 38 && currentEntry.next) {
                                e.preventDefault();
                                formikProps.setValues({
                                    input: currentEntry.next.value.text,
                                });
                                setCurrentEntry(currentEntry.next);
                            }
                            if (e.keyCode === 40 && currentEntry.previous) {
                                e.preventDefault();
                                formikProps.setValues({
                                    input: currentEntry.previous.value.text,
                                });
                                setCurrentEntry(currentEntry.previous);
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
                                    height: `${0.8 * textAreaSize}vh`,
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

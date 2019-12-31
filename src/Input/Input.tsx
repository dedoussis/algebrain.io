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
    initialInput?: string;
};

const Input: React.FC<InputProps> = ({
    userEntries,
    onNewEntry,
    textAreaSize,
    initialInput = '',
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
        userEntries.prepend(generateUserEntry(initialInput)).head as LinkedItem<
            Entry
        >
    );
    useEffect(
        () =>
            setCurrentEntry(
                userEntries.prepend(generateUserEntry(initialInput))
                    .head as LinkedItem<Entry>
            ),
        [userEntries]
    );

    return (
        <Formik
            initialValues={{ input: initialInput }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                resetForm();
                onNewEntry(generateUserEntry(values.input.trim()));
                setSubmitting(false);
            }}
        >
            {({ submitForm, setValues }) => (
                <Form
                    onKeyDown={e => {
                        if (e.keyCode === 13 && !e.shiftKey) {
                            e.preventDefault();
                            submitForm();
                        }
                        if (e.keyCode === 38 && currentEntry.next) {
                            e.preventDefault();
                            setValues({
                                input: currentEntry.next.value.text,
                            });
                            setCurrentEntry(currentEntry.next);
                        }
                        if (e.keyCode === 40 && currentEntry.previous) {
                            e.preventDefault();
                            setValues({
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
            )}
        </Formik>
    );
};

export default Input;

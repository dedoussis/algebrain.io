import React, { useState, useEffect, useRef, Dispatch } from 'react';
import './Terminal.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Algebrain, { Namespace, Output, Executable } from 'algebrain';
import { Formik, Form, Field } from 'formik';
import { Map, List } from 'immutable';

enum Agent {
    ALGEBRAIN = '🧠',
    ME = '🙂',
}

interface Entry {
    timestamp: string;
    agent: Agent;
    text: string;
}

const EntryOutput: React.FC<Entry> = entry => {
    const { timestamp, agent, text } = entry;
    return (
        <div title={timestamp}>
            <span className="agent">{agent}</span>&nbsp;&nbsp;
            <span>{text}</span>
            <br />
        </div>
    );
};

const Input: React.FC<{ onNewEntry: (entry: Entry) => void }> = props => {
    return (
        <Formik
            initialValues={{ input: '' }}
            onSubmit={(values, { setSubmitting, setFieldValue }) => {
                setFieldValue('input', '');
                setTimeout(() => {
                    props.onNewEntry({
                        timestamp: new Date().toLocaleTimeString(),
                        agent: Agent.ME,
                        text: values.input,
                    });
                    setSubmitting(false);
                }, 50);
            }}
            render={_ => {
                return (
                    <Form>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>>></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                as={Field}
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

const Printer: React.FC<{ entries: List<Entry> }> = props => {
    let bottomRef: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (
            bottomRef.current instanceof HTMLDivElement &&
            bottomRef.current.hasOwnProperty('scrollIntoView')
        ) {
            bottomRef.current.scrollIntoView();
        }
    });

    return (
        <Container>
            {props.entries.map((entry, index) => (
                <Row key={`entry-${index}`}>
                    <EntryOutput {...entry} />
                </Row>
            ))}
            <div
                ref={div => {
                    bottomRef = { current: div };
                }}
            ></div>
        </Container>
    );
};

function generateAlgebrainEntry(text: string): Entry {
    return {
        timestamp: new Date().toLocaleTimeString(),
        agent: Agent.ALGEBRAIN,
        text: text,
    };
}

const Terminal: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
    const [namespace, setNamespace]: [
        Namespace,
        Dispatch<Namespace>
    ] = useState({
        expression: Algebrain.parse(''),
        transformationName: 'n/a',
        transformations: Map(),
    });

    const [entries, setEntries]: [
        List<Entry>,
        Dispatch<List<Entry>>
    ] = useState(
        List([
            generateAlgebrainEntry('Welcome to Algebrain!'),
            generateAlgebrainEntry(
                'Use the help command for usage instructions'
            ),
        ])
    );

    const onNewEntry: (entry: Entry) => void = (entry: Entry) => {
        const executable: Executable = Algebrain.parse(
            entry.text.toString().trim()
        );
        const output: Output = executable.execute(namespace);
        setNamespace(output.namespace);
        setEntries(
            entries.concat(List([entry, generateAlgebrainEntry(output.stdOut)]))
        );
    };
    return (
        <div className="terminal">
            <div className="terminal-output">
                <Printer entries={entries} />
            </div>
            <div className="terminal-input">
                <Input onNewEntry={onNewEntry} />
            </div>
        </div>
    );
};

export default Terminal;

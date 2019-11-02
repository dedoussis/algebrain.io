import React, { useState, useEffect, useRef, Dispatch } from 'react';
import './Terminal.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Algebrain, { Namespace, Output, Executable } from 'algebrain';
import { Formik, Form, Field } from 'formik';
import { Map, List } from 'immutable';

const Arrow: React.FC = () => {
    return <span>&rarr;&nbsp;</span>;
};

enum Agent {
    ALGEBRAIN = '🧠',
    YOU = '👶',
}

interface Entry {
    timestamp: string;
    agent: Agent;
    text: string;
}

const StdOut: React.FC<Entry> = entry => {
    const { timestamp, agent, text } = entry;
    return (
        <Row>
            <Col>
                <Arrow />
                <span className="timestamp">[{timestamp}]</span>&nbsp;
                <span className="agent">{agent}</span>&nbsp;&nbsp;
                <span>{text}</span>
                <br />
            </Col>
        </Row>
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
                        agent: Agent.YOU,
                        text: values.input,
                    });
                    setSubmitting(false);
                }, 50);
            }}
            render={_ => {
                return (
                    <Form>
                        <Field name="input" autoComplete="off" />
                    </Form>
                );
            }}
        />
    );
};

const Printer: React.FC<{ entries: List<Entry> }> = props => {
    let bottomRef: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (bottomRef.current instanceof HTMLDivElement) {
            bottomRef.current.scrollIntoView();
        }
    });

    return (
        <Container className="printer">
            {props.entries.map(entry => (
                <StdOut {...entry} />
            ))}
            <div
                ref={div => {
                    bottomRef = { current: div };
                }}
            ></div>
        </Container>
    );
};

const Terminal: React.FC = () => {
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
    ] = useState(List());

    const onNewEntry: (entry: Entry) => void = (entry: Entry) => {
        const executable: Executable = Algebrain.parse(
            entry.text.toString().trim()
        );
        const output: Output = executable.execute(namespace);
        setNamespace(output.namespace);
        const algebrainEntry: Entry = {
            timestamp: new Date().toLocaleTimeString(),
            agent: Agent.ALGEBRAIN,
            text: output.stdOut,
        };
        setEntries(entries.concat(List([entry, algebrainEntry])));
    };
    return (
        <Container>
            <Row>
                <Printer entries={entries} />
            </Row>
            <Row>
                <Input onNewEntry={onNewEntry} />
            </Row>
        </Container>
    );
};

export default Terminal;

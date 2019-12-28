import React, { useState, useEffect, useRef, Dispatch } from 'react';
import './Terminal.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Algebrain, {
    Namespace,
    Transformation,
    Output,
    Executable,
    ExecuteError,
    differentiation,
    simplification,
    fibonacci,
} from 'algebrain';
import { Formik, Form, Field } from 'formik';
import { Map, List } from 'immutable';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

enum Agent {
    ALGEBRAIN = '🧠',
    ME = '🙂',
}

interface Entry {
    timestamp: string;
    agent: Agent;
    text: string;
}

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
                    props.onNewEntry({
                        timestamp: new Date().toLocaleTimeString(),
                        agent: Agent.ME,
                        text: values.input.trim(),
                    });
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

const Printer: React.FC<{ entries: List<Entry> }> = props => {
    let bottomRef: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        if (
            bottomRef.current instanceof HTMLDivElement &&
            typeof bottomRef.current.scrollIntoView === 'function'
        ) {
            bottomRef.current.scrollIntoView();
        }
    });

    return (
        <Container>
            {props.entries.map((entry, index) => (
                <Row title={entry.timestamp} key={`entry-${index}`}>
                    <Col className="agent pl-0">{entry.agent}</Col>
                    <Col
                        className={`pr-0 ${
                            Object.values(ExecuteError).includes(
                                entry.text as ExecuteError
                            )
                                ? 'error-text'
                                : 'text'
                        }`}
                    >
                        {entry.text}
                    </Col>
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

const SettingsPanel: React.FC<{
    vertical: boolean;
    verticalSetter: (vertical: boolean) => void;
}> = props => {
    const onColumnsClick: (e: React.MouseEvent) => void = e => {
        e.preventDefault();
        props.verticalSetter(!props.vertical);
    };
    return (
        <div className="settings-panel">
            <Button onClick={onColumnsClick}>
                <FontAwesomeIcon icon={faColumns} size="2x" />
            </Button>
            <Button href="https://github.com/dedoussis/algebrain">
                <FontAwesomeIcon icon={faGithub} size="2x" />
            </Button>
        </div>
    );
};

const Terminal: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
    const presetTransformations: Map<string, Executable> = Map<
        string,
        Transformation
    >()
        .set(differentiation.name, differentiation)
        .set(simplification.name, simplification)
        .set(fibonacci.name, fibonacci);

    const [namespace, setNamespace]: [Namespace, Dispatch<any>] = useState({
        transformations: presetTransformations,
        transformationName: simplification.name,
    });

    const [entries, setEntries]: [
        List<Entry>,
        Dispatch<List<Entry>>
    ] = useState(
        List([
            generateAlgebrainEntry('Welcome to Algebrain!'),
            generateAlgebrainEntry(
                'Try the help command for usage instructions'
            ),
        ])
    );

    const [vertical, setVertical]: [boolean, Dispatch<any>] = useState(true);

    const [inputPaneSize, setInputPaneSize]: [number, Dispatch<any>] = useState(
        0
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
        <div>
            <SettingsPanel vertical={vertical} verticalSetter={setVertical} />
            <SplitterLayout
                customClassName="terminal"
                vertical={vertical}
                percentage={true}
                primaryMinSize={15}
                secondaryMinSize={15}
                secondaryInitialSize={35}
                onSecondaryPaneSizeChange={(newSize: number) =>
                    setInputPaneSize(newSize)
                }
            >
                <div className="terminal-output">
                    <Printer entries={entries} />
                </div>
                <div className="terminal-input">
                    <Input
                        aria-label="command line"
                        onNewEntry={onNewEntry}
                        textAreaSize={vertical ? inputPaneSize : 100}
                    />
                </div>
            </SplitterLayout>
        </div>
    );
};

export default Terminal;

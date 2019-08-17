import React from 'react';
import './Terminal.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Formik, Form, Field } from 'formik';

const Arrow: React.FC = () => {
    return <span>&rarr;&nbsp;</span>;
};

interface Entry {
    timestamp: string;
    agent: string;
    message: string;
}

const StdOut: React.FC<Entry> = entry => {
    const { timestamp, agent, message } = entry;
    return (
        <Row>
            <Col>
                <Arrow />
                <span className="timestamp">[{timestamp}]</span>&nbsp;
                <span className="agent">{agent}</span>&nbsp;&nbsp;
                <span>{message}</span>
                <br />
            </Col>
        </Row>
    );
};

interface Props {
    onNewEntry: (entry: Entry) => void;
}

const Input: React.FC<Props> = props => {
    return (
        <Formik
            initialValues={{ input: '' }}
            onSubmit={(values, { setSubmitting, setFieldValue }) => {
                setFieldValue('input', '');
                setTimeout(() => {
                    props.onNewEntry({
                        timestamp: new Date().toLocaleString(),
                        agent: 'You',
                        message: values.input,
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

interface Entries {
    entries: Entry[];
}

class Printer extends React.Component<Entries, {}> {
    bottomRef: React.RefObject<HTMLDivElement> = React.createRef();

    scrollToBottom() {
        if (this.bottomRef.current instanceof HTMLDivElement) {
            this.bottomRef.current.scrollIntoView();
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        const { entries } = this.props;
        return (
            <Container className="printer">
                {entries.map(entry => (
                    <StdOut {...entry} />
                ))}
                <div
                    ref={div => {
                        this.bottomRef = { current: div };
                    }}
                ></div>
            </Container>
        );
    }
}

export default class Terminal extends React.Component<{}, Entries> {
    state: Entries = {
        entries: [],
    };

    onNewEntry(entry: Entry): void {
        this.setState(previousState => ({
            entries: [...previousState.entries, entry],
        }));
    }

    render() {
        return (
            <Container>
                <Row>
                    <Printer entries={this.state.entries} />
                </Row>
                <Row>
                    <Input onNewEntry={this.onNewEntry.bind(this)} />
                </Row>
            </Container>
        );
    }
}

import React, { useEffect, useRef } from 'react';
import './Printer.css';

import { List } from 'immutable';
import { ExecuteError } from 'algebrain';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Entry } from '../utils';

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

export default Printer;

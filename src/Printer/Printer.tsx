import React, { useEffect, useRef } from 'react';
import './Printer.css';

import { List } from 'immutable';
import { ExecuteError, CommandName } from 'algebrain';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Entry, Stream } from '../utils';
import Highlighter, { Chunk, FindChunks } from 'react-highlight-words';

const commands: string[] = Object.values(CommandName);
const errors: string[] = Object.values(ExecuteError);

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
    const cells = props.entries.reduce(
        (cells: List<List<Entry>>, entry: Entry) => {
            if (entry.stream === Stream.Input) {
                return cells.push(List([entry]));
            }
            const currentGroup = cells.last(List());
            const updatedCurrentGroup = currentGroup.push(entry);
            return cells.butLast().push(updatedCurrentGroup);
        },
        List()
    );

    return (
        <Container>
            {cells.map((cell, groupIdx) => (
                <Row
                    className={`rounded py-1 my-1 cell ${groupIdx % 2 !== 0 &&
                        'cell-dark'}`}
                    key={`cell-${groupIdx}`}
                >
                    <Col>
                        {cell.map((entry, entryIdx) => (
                            <Row className="my-1" key={`entry-${entryIdx}`}>
                                <Col
                                    className={`stream px-0 ${entry.stream.toLowerCase()}`}
                                    title={entry.timestamp}
                                >
                                    {entry.stream}
                                </Col>
                                <Col
                                    className={`pl-4 pr-0 ${
                                        errors.includes(
                                            entry.text as ExecuteError
                                        )
                                            ? 'error-text'
                                            : 'text'
                                    }`}
                                >
                                    <Highlighter
                                        highlightClassName="command"
                                        searchWords={commands}
                                        textToHighlight={entry.text}
                                        caseSensitive
                                        findChunks={customFindChunks}
                                    />
                                </Col>
                            </Row>
                        ))}
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

const customFindChunks: (options: FindChunks) => Chunk[] = ({
    autoEscape,
    caseSensitive,
    sanitize,
    searchWords,
    textToHighlight,
}) => {
    return searchWords
        .filter(searchWord => searchWord) // Remove empty words
        .reduce((chunks, searchWord) => {
            const regex = new RegExp(
                `\\b${searchWord}\\b`,
                caseSensitive ? 'g' : 'gi'
            );

            let match;
            while ((match = regex.exec(textToHighlight))) {
                const start = match.index;
                const end = regex.lastIndex;
                if (end > start) {
                    chunks = chunks.push({ highlight: false, start, end });
                }
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
            }

            return chunks;
        }, List())
        .toArray();
};

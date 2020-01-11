import React, { useState, Dispatch } from 'react';
import './Terminal.css';
import Algebrain, {
    Namespace,
    Transformation,
    Node,
    Output,
    Executable,
    differentiation,
    simplification,
    fibonacci,
} from 'algebrain';
import { Map, List } from 'immutable';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { Entry, Agent, generateAlgebrainEntry, LinkedList } from '../utils';
import Input from '../Input/Input';
import Printer from '../Printer/Printer';

const Terminal: React.FC<{
    vertical: boolean;
    customClassName?: string;
}> = props => {
    const presetTransformations: Map<string, Transformation> = Map<
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

    const onNewEntry: (entry: Entry) => void = (entry: Entry) => {
        const executable: Executable = Algebrain.parse(
            entry.text.toString().trim()
        );
        let output: Output = executable.execute(namespace);
        if (
            output.namespace.expression &&
            !output.namespace.expression.equals(namespace.expression)
        ) {
            const simplified: Node = simplification.transform(
                output.namespace.expression
            );
            output = {
                namespace: {
                    ...output.namespace,
                    expression: simplified,
                },
                stdOut: simplified.toString(),
            };
        }
        setNamespace(output.namespace);
        setEntries(
            entries.concat([entry, generateAlgebrainEntry(output.stdOut)])
        );
    };

    return (
        <SplitterLayout
            customClassName={props.customClassName}
            vertical={props.vertical}
            percentage={true}
            primaryMinSize={15}
            secondaryMinSize={15}
            secondaryInitialSize={35}
        >
            <div className="terminal-output">
                <Printer entries={entries} />
            </div>
            <div className="terminal-input">
                <Input
                    aria-label="command line"
                    onNewEntry={onNewEntry}
                    userEntries={LinkedList.fromList(
                        entries.filter(entry => entry.agent === Agent.Me)
                    )}
                />
            </div>
        </SplitterLayout>
    );
};

export default Terminal;

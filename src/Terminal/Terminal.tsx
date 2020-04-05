import React, { useState, Dispatch } from 'react';
import './Terminal.css';
import Algebrain, {
    Namespace,
    Transformation,
    Output,
    Executable,
    differentiation,
    simplification,
    fibonacci,
    integral,
} from 'algebrain';
import { Map, List } from 'immutable';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import { Entry, Stream, generateOutputEntry, LinkedList } from '../utils';
import Input from '../Input/Input';
import Printer from '../Printer/Printer';

const Terminal: React.FC<{
    vertical: boolean;
    customClassName?: string;
}> = props => {
    const presetTransformations: Map<string, Transformation> = Map({
        [differentiation.name]: differentiation,
        [simplification.name]: simplification,
        [fibonacci.name]: fibonacci,
        [integral.name]: integral,
    });

    const [namespace, setNamespace]: [Namespace, Dispatch<any>] = useState({
        transformations: presetTransformations,
        transformationName: simplification.name,
    });

    const [entries, setEntries]: [
        List<Entry>,
        Dispatch<List<Entry>>
    ] = useState(
        List([
            generateOutputEntry('Welcome to Algebrain!'),
            generateOutputEntry('Try the help command for usage instructions'),
        ])
    );

    const onNewEntry: (entry: Entry) => void = (entry: Entry) => {
        const executable: Executable = Algebrain.parse(entry.text);
        let output: Output = executable.execute(namespace);
        if (
            output.namespace.expression &&
            !output.namespace.expression.equals(namespace.expression)
        ) {
            const namespaceSimplification = output.namespace.transformations.get(
                simplification.name,
                simplification
            );
            const simplified = output.namespace.expression.transform(
                namespaceSimplification
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
        setEntries(entries.concat([entry, generateOutputEntry(output.stdOut)]));
    };

    return (
        <SplitterLayout
            customClassName={props.customClassName}
            vertical={props.vertical}
            percentage
            primaryMinSize={15}
            secondaryMinSize={15}
            secondaryInitialSize={25}
        >
            <div className={`terminal-output ${props.vertical ? '' : 'pr-3'}`}>
                <Printer entries={entries} />
            </div>
            <div className="terminal-input">
                <Input
                    aria-label="command line"
                    onNewEntry={onNewEntry}
                    userEntries={LinkedList.fromList(
                        entries.filter(entry => entry.stream === Stream.Input)
                    )}
                />
            </div>
        </SplitterLayout>
    );
};

export default Terminal;

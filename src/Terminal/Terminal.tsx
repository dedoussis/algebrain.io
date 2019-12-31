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
import { useMediaQuery } from 'react-responsive';
import { Entry, Agent, generateAlgebrainEntry, LinkedList } from '../utils';
import Input from '../Input/Input';
import Printer from '../Printer/Printer';
import SettingsPanel from '../SettingsPanel/SettingsPanel';

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

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1224px)',
    });

    const onNewEntry: (entry: Entry) => void = (entry: Entry) => {
        const executable: Executable = Algebrain.parse(
            entry.text.toString().trim()
        );
        let output: Output = executable.execute(namespace);
        if (
            namespace.expression &&
            !namespace.expression.equals(output.namespace.expression)
        ) {
            const simplified: Node = simplification.transform(
                output.namespace.expression as Node
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
        <div>
            {isDesktopOrLaptop && (
                <SettingsPanel
                    vertical={vertical}
                    verticalSetter={setVertical}
                />
            )}
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
                        userEntries={LinkedList.fromList(
                            entries.filter(entry => entry.agent === Agent.Me)
                        )}
                    />
                </div>
            </SplitterLayout>
        </div>
    );
};

export default Terminal;

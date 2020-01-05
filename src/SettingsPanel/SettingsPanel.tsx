import React from 'react';
import './SettingsPanel.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faColumns,
    faBook,
    faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const SettingsPanel: React.FC<{
    vertical: boolean;
    verticalSetter: (vertical: boolean) => void;
    customClassName?: string;
}> = props => {
    const onColumnsClick: (e: React.MouseEvent) => void = e => {
        e.preventDefault();
        props.verticalSetter(!props.vertical);
    };
    return (
        <div className={`settings-panel ${props.customClassName}`}>
            <Button
                title={`Switch to ${
                    props.vertical ? 'horizontal' : 'vertical'
                } layout`}
                onClick={onColumnsClick}
            >
                <FontAwesomeIcon icon={faColumns} size="2x" />
            </Button>
            <Button
                title="Github"
                href="https://github.com/dedoussis/algebrain"
            >
                <FontAwesomeIcon icon={faGithub} size="2x" />
            </Button>
            <Button
                title="Documentation"
                href="https://github.com/dedoussis/algebrain/docs"
            >
                <FontAwesomeIcon icon={faBook} size="2x" />
            </Button>
            <Button title="Export" disabled={true}>
                <FontAwesomeIcon icon={faFileExport} size="2x" />
            </Button>
        </div>
    );
};

export default SettingsPanel;

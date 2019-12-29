import React from 'react';
import './SettingsPanel.css';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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

export default SettingsPanel;

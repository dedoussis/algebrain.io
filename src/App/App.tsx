import React, { useState, Dispatch } from 'react';
import './App.css';
import Terminal from '../Terminal/Terminal';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import { useMediaQuery } from 'react-responsive';

const App: React.FC = () => {
    const [vertical, setVertical]: [boolean, Dispatch<any>] = useState(true);
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1224px)',
    });
    return (
        <div>
            <header>
                {isDesktopOrLaptop && (
                    <SettingsPanel
                        customClassName="mt-2"
                        vertical={vertical}
                        verticalSetter={setVertical}
                    />
                )}
            </header>
            <div className="main">
                <Terminal customClassName="px-3 pb-3" vertical={vertical} />
            </div>
            <footer></footer>
        </div>
    );
};

export default App;

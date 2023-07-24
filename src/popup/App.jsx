import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from '@popup/components/Nav.jsx';
import Config from '@popup/components/Config.jsx';
import Download from '@popup/components/Download.jsx';

export default function App() {
  const [tab, setTab] = useState('config');

  useEffect(() => {
    chrome.storage.local.get(['tab'], (result) => {
      if (result.tab) {
        setTab(result.tab);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ tab });
  }, [tab]);

  const handleSelect = (key) => {
    setTab(key);
  };

  return (
    <div>
      <Nav />
      <Tabs activeKey={tab} id="tabs" onSelect={handleSelect}>
        <Tab eventKey="config" title="Config">
          <Config />
        </Tab>
        <Tab eventKey="download" title="Download">
          <Download />
        </Tab>
        <Tab eventKey="bookmark" title="Bookmark" disabled>
          Tab content for Contact
        </Tab>
      </Tabs>
    </div>
  );
}

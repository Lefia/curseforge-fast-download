import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';

import data from '@data/data.json';

export default function Config() {
  const [version, setVersion] = useState(''); // Game Version
  const [loader, setLoader] = useState(''); // Mod Loader
  const [key, setKey] = useState(''); // API key
  const [isVersionValid, setIsVersionValid] = useState(false);
  const [isLoaderValid, setIsLoaderValid] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [applyCount, setApplyCount] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(['game-version', 'mod-loader', 'api-key'], (result) => {
      const gameVersion = result['game-version'] || '';
      const modLoader = result['mod-loader'] || '';
      const apiKey = result['api-key'] || '';
      setVersion(gameVersion);
      setLoader(modLoader);
      setKey(apiKey);
    });
  }, []);

  useEffect(() => {
    if (isLoaderValid && isVersionValid && isKeyValid && applyCount > 0) {
      chrome.storage.sync.set({ 'game-version': version });
      chrome.storage.sync.set({ 'mod-loader': loader });
      chrome.storage.sync.set({ 'api-key': key });
    }
  }, [applyCount]);

  const handleVersionValid = () => {
    if (applyCount > 0) {
      return isVersionValid ? 'is-valid' : 'is-invalid';
    }
    return '';
  };

  const handleLoaderValid = () => {
    if (applyCount > 0) {
      return isLoaderValid ? 'is-valid' : 'is-invalid';
    }
    return '';
  };

  const handleKeyValid = () => {
    if (applyCount > 0) {
      return isKeyValid ? 'is-valid' : 'is-invalid';
    }
    return '';
  };

  const apply = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setApplyCount(applyCount + 1);
    setIsVersionValid(data['game-version-list'].includes(version));
    setIsLoaderValid(loader !== '');
    setIsKeyValid(key !== '');
  };

  return (
    <Form className="p-3">
      <Row className="mb-3">
        <Form.Group as={Col} xs="6" controlId="game-version">
          <Form.Label>Game Version</Form.Label>
          <Form.Control
            type="text"
            name="game-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className={`${handleVersionValid()}`}
          />
          <Form.Control.Feedback type="invalid">
            Please input a valid game version.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} xs="6" controlId="mod-loader">
          <Form.Label>Mod Loader</Form.Label>
          <Form.Select
            value={loader}
            onChange={(e) => setLoader(e.target.value)}
            className={`${handleLoaderValid()}`}
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="forge">Forge</option>
            <option value="fabric">Fabric</option>
            <option value="qulit">Qulit</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">Please select a mod loader.</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-4">
        <Form.Group as={Col} controlId="api-key">
          <Form.Label>API key</Form.Label>
          <Form.Control
            type="text"
            name="api-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={`${handleKeyValid()}`}
          />
          <Form.Control.Feedback type="invalid">Please input a valid API.</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button variant="primary" onClick={apply}>
        Apply
      </Button>
    </Form>
  );
}

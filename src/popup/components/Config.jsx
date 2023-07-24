import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form, Toast } from 'react-bootstrap';

import data from '@/assets/data/data.json';

export default function Config() {
  const [version, setVersion] = useState(''); // Game Version
  const [loader, setLoader] = useState(''); // Mod Loader
  const [isVersionValid, setIsVersionValid] = useState(false);
  const [isLoaderValid, setIsLoaderValid] = useState(false);
  const [applyCount, setApplyCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['game-version', 'mod-loader'], (result) => {
      const gameVersion = result['game-version'] || '';
      const modLoader = result['mod-loader'] || '';
      setVersion(gameVersion);
      setLoader(modLoader);
    });
  }, []);

  useEffect(() => {
    if (isLoaderValid && isVersionValid && applyCount > 0) {
      chrome.storage.sync.set({ 'game-version': version });
      chrome.storage.sync.set({ 'mod-loader': loader });
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

  const apply = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShow(true);
    setApplyCount(applyCount + 1);
    setIsVersionValid(data['game-version-list'].includes(version));
    setIsLoaderValid(loader !== '');
  };

  return (
    <Form className="p-4">
      <Row className="mb-4">
        <Form.Group as={Col} xs="6" controlId="gameVersion">
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
        <Form.Group as={Col} xs="6" controlId="modLoader">
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
      <Button className="mb-3" variant="primary" onClick={apply}>
        Apply
      </Button>
      <Toast
        className="position-absolute start-50 translate-middle"
        style={{ width: '165px' }}
        onClose={() => setShow(false)}
        show={show}
        delay={1200}
        autohide
      >
        <Toast.Body>Applied Successfully!</Toast.Body>
      </Toast>
    </Form>
  );
}

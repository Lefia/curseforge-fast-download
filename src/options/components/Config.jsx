import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form, Toast } from 'react-bootstrap';

import data from '@data/data.json';

export default function Config() {
  const [version, setVersion] = useState({
    value: '',
    isValid: false,
  });
  const [loader, setLoader] = useState({
    value: '',
    isValid: false,
  });
  const [key, setKey] = useState({
    value: '',
    isValid: false,
  });
  const [applyCount, setApplyCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['gameVersion', 'modLoader', 'apiKey'], (result) => {
      const { gameVersion = '', modLoader = '', apiKey = '' } = result;
      setVersion({ ...version, value: gameVersion });
      setLoader({ ...loader, value: modLoader });
      setKey({ ...key, value: apiKey });
    });
  }, []);

  useEffect(() => {
    if (loader.isValid && version.isValid && key.isValid && applyCount > 0) {
      setShow(true);
      chrome.storage.sync.set({
        gameVersion: version.value,
        modLoader: loader.value,
        apiKey: key.value,
      });
    }
  }, [applyCount]);

  const handleVersionValid = () => {
    if (applyCount > 0) {
      return version.isValid ? 'is-valid' : 'is-invalid';
    }
    return '';
  };

  const handleLoaderValid = () => {
    if (applyCount > 0) {
      return loader.isValid ? 'is-valid' : 'is-invalid';
    }
    return '';
  };

  const handleKeyValid = () => {
    if (applyCount > 0) {
      return key.isValid ? 'is-valid' : 'is-invalid';
    }
    return '';
  };

  const handleApplyClick = () => {
    setApplyCount(applyCount + 1);
    setVersion({ ...version, isValid: data['game-version-list'].includes(version.value) });
    setLoader({ ...loader, isValid: loader.value !== '' });
    setKey({ ...key, isValid: key.value !== '' });
  };

  return (
    <Form className="p-3">
      <Row className="mb-3">
        <Form.Group as={Col} xs="6" controlId="game-version">
          <Form.Label>Game Version</Form.Label>
          <Form.Control
            type="text"
            name="game-version"
            value={version.value}
            onChange={(e) => setVersion({ ...version, value: e.target.value })}
            className={`${handleVersionValid()}`}
          />
          <Form.Control.Feedback type="invalid">
            Please input a valid game version.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} xs="6" controlId="mod-loader">
          <Form.Label>Mod Loader</Form.Label>
          <Form.Select
            value={loader.value}
            onChange={(e) => setLoader({ ...loader, value: e.target.value })}
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
            value={key.value}
            onChange={(e) => setKey({ ...key, value: e.target.value })}
            className={`${handleKeyValid()}`}
          />
          <Form.Control.Feedback type="invalid">Please input a valid API.</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button name="apply" variant="primary" type="button" onClick={handleApplyClick}>
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

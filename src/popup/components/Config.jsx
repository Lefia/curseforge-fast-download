import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form, Toast } from 'react-bootstrap';

import data from '@/assets/data/data.json';

export default function Config() {
  const [version, setVersion] = useState({
    value: '',
    isValid: false,
  });
  const [loader, setLoader] = useState({
    value: '',
    isValid: false,
  });
  const [show, setShow] = useState(false);
  const [applyCount, setApplyCount] = useState(0);

  useEffect(() => {
    chrome.storage.sync.get(['gameVersion', 'modLoader'], (result) => {
      const { gameVersion = '', modLoader = '' } = result;
      setVersion({ ...version, value: gameVersion });
      setLoader({ ...loader, value: modLoader });
    });
  }, []);

  useEffect(() => {
    if (version.isValid && loader.isValid && applyCount > 0) {
      setShow(true);
      chrome.storage.sync.set({ gameVersion: version.value, modLoader: loader.value });
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

  const handleApplyClick = () => {
    setApplyCount(applyCount + 1);
    setVersion({ ...version, isValid: data['game-version-list'].includes(version.value) });
    setLoader({ ...loader, isValid: loader.value !== '' });
  };

  return (
    <Form className="p-4">
      <Row className="mb-4">
        <Form.Group as={Col} xs="6" controlId="gameVersion">
          <Form.Label>Game Version</Form.Label>
          <Form.Control
            type="text"
            name="gameVersion"
            value={version.value}
            onChange={(e) => setVersion({ ...version, value: e.target.value })}
            className={`${handleVersionValid()}`}
          />
          <Form.Control.Feedback type="invalid">
            Please input a valid game version.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} xs="6" controlId="modLoader">
          <Form.Label>Mod Loader</Form.Label>
          <Form.Select
            name="modLoader"
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
      <Button
        name="apply"
        className="mb-3"
        variant="primary"
        type="button"
        onClick={handleApplyClick}
      >
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

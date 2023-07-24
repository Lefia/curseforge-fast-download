import React, { useState, useEffect } from 'react';
import { ListGroup, Form, InputGroup, Row, Col, Card, Button } from 'react-bootstrap';

export default function Download() {
  const [downloadList, setDownloadList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('Lastest');
  const [sortDirection, setSortDirection] = useState('Asc');

  useEffect(() => {
    chrome.storage.local.get(['download-list'], (result) => {
      setDownloadList(result['download-list']);
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.text === 'download-list-updated') {
        chrome.storage.local.get(['download-list'], (result) => {
          setDownloadList(result['download-list']);
        });
      }
    });
  }, []);

  const getSortIcon = () => {
    if (sortDirection === 'Asc') {
      return <i className="fa-solid fa-arrow-up-short-wide"></i>;
    }
    return <i className="fa-solid fa-arrow-up-wide-short"></i>;
  };

  const getResultList = () => {
    const searchList = downloadList.filter((mod) => mod.name.toLowerCase().includes(searchText));
    let sortedList = [];
    switch (sortType) {
      case 'Name':
        sortedList = searchList.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          return -1;
        });
        break;
      case 'Lastest':
        sortedList = searchList;
        break;
      default:
        sortedList = searchList;
    }

    if (sortDirection === 'Desc') {
      sortedList.reverse();
    }
    return sortedList;
  };

  const handleAccept = (index) => {
    const updatedList = [...downloadList];
    chrome.downloads.acceptDanger(updatedList[index].downloadId);
    updatedList[index].status = 'Downloaded';
    setDownloadList(updatedList);
    chrome.storage.local.set({ 'download-list': updatedList });
  };

  const handleDelete = (index) => {
    const updatedList = getResultList();
    if (updatedList[index].status === 'Downloading') {
      chrome.downloads.cancel(updatedList[index].downloadId);
    } else {
      chrome.downloads.removeFile(updatedList[index].downloadId);
    }
    updatedList.splice(index, 1);
    setDownloadList(updatedList);

    chrome.storage.local.set({ 'download-list': updatedList });
  };

  return (
    <div className="m-3">
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} xs="7">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            />
          </Form.Group>
          <Form.Group as={Col} xs="5">
            <InputGroup>
              <Form.Select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="Lastest">Lastest</option>
                <option value="Name">Name</option>
              </Form.Select>
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setSortDirection(sortDirection === 'Asc' ? 'Desc' : 'Asc')}
              >
                {getSortIcon()}
              </Button>
            </InputGroup>
          </Form.Group>
        </Row>
      </Form>
      <Card style={{ height: '285px' }}>
        <ListGroup id="download-list">
          {getResultList().map((mod, index) => (
            <ListGroup.Item
              key={index}
              variant={mod.status === 'Downloading' ? 'warning' : ''}
              className="item"
            >
              <div className="item-info">
                <span className="item-index">{index + 1}</span>
                <img src={mod.icon} className="item-index" />
                <a
                  href={mod.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-light"
                >
                  {mod.name}
                </a>
              </div>
              <div>
                {mod.status === 'Downloading' && (
                  <Button
                    type="button"
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleAccept(index)}
                  >
                    Accept
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
}

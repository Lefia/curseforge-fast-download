import React, { useState, useEffect } from 'react';
import { ListGroup, Form, InputGroup, Row, Col, Card, Button } from 'react-bootstrap';

export default function Download() {
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sort, setSort] = useState({
    type: 'Lastest',
    direction: 'Asc',
  });

  useEffect(() => {
    chrome.storage.local.get(['downloadList'], (result) => {
      const { downloadList = [] } = result;
      setList(downloadList);
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.text === 'download-list-updated') {
        chrome.storage.local.get(['downloadList'], (result) => {
          const { downloadList = [] } = result;
          setList(downloadList);
        });
      }
    });
  }, []);

  const handleAcceptClick = (id) => () => {
    const updatedList = [...list];
    const index = updatedList.findIndex((mod) => mod.id === id);
    const { downloadId } = updatedList[index];
    chrome.downloads.acceptDanger(downloadId);
  };

  const handleDeleteClick = (id) => () => {
    const updatedList = [...list];
    const index = updatedList.findIndex((mod) => mod.id === id);
    const { status } = updatedList[index];

    if (status === 'Downloading') {
      chrome.downloads.cancel(updatedList[index].downloadId);
    } else {
      chrome.downloads.removeFile(updatedList[index].downloadId);
    }
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSortTypeChange = (e) => {
    setSort({ ...sort, type: e.target.value });
  };

  const handleSortDirectionClick = () => {
    setSort({ ...sort, direction: sort.direction === 'Asc' ? 'Desc' : 'Asc' });
  };

  const getSortIcon = () => {
    if (sort.direction === 'Asc') {
      return <i className="fa-solid fa-arrow-up-short-wide"></i>;
    }
    return <i className="fa-solid fa-arrow-up-wide-short"></i>;
  };

  const getResultList = () => {
    const text = searchText.toLowerCase();
    const searchedList = list.filter((mod) => mod.name.toLowerCase().includes(text));
    let sortedList = [];
    switch (sort.type) {
      case 'Name':
        sortedList = searchedList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Lastest':
      default:
        sortedList = searchedList;
    }

    if (sort.direction === 'Desc') {
      sortedList.reverse();
    }
    return sortedList;
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
              onChange={(e) => handleSearchTextChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} xs="5">
            <InputGroup>
              <Form.Select
                name="sortType"
                value={sort.type}
                onChange={(e) => handleSortTypeChange(e)}
              >
                <option value="Lastest">Lastest</option>
                <option value="Name">Name</option>
              </Form.Select>
              <Button variant="outline-secondary" type="button" onClick={handleSortDirectionClick}>
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
                    onClick={handleAcceptClick(mod.id)}
                  >
                    Accept
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={handleDeleteClick(mod.id)}
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

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { filterDateTimeFormat } from "../../constants";
import api from "helpers/api";
import moment from "moment";
import "./styles.css";

function AddEventModal({ setIsModalOpen, isModalOpen, getEvents, API_KEY }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleClose = () => setIsModalOpen(false);

  const handleSave = () => {
    const event = {
      summary: `${title}`,
      end: {
        dateTime: `${moment(end).utc().format(filterDateTimeFormat)}`,
      },
      start: {
        dateTime: `${moment(start).utc().format(filterDateTimeFormat)}`,
      },
    };
    api
      .post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${API_KEY}`,
        event
      )
      .then(() => {
        handleClose();
        getEvents();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div>
      <Modal show={isModalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title*</Form.Label>
              <Form.Control
                value={title}
                type="text"
                placeholder="Enter event title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start*</Form.Label>
              <br />
              <input
                className="dateTime_input"
                type="datetime-local"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End*</Form.Label>
              <br />
              <input
                className="dateTime_input"
                type="datetime-local"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={!title || !start || !end}
          >
            Save event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddEventModal;

import React, { useEffect } from "react";
import moment from "moment";
import { defaultDateTimeFormat } from "constants";
import { Spinner, Button } from "react-bootstrap";
import "./styles.css";

function EventsList({ isLoadingEvents, events, getEvents, deleteEvent }) {
  useEffect(() => {
    getEvents();
  }, []);

  if (isLoadingEvents) {
    return (
      <div className="loader">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <ul>
        {events && events.length > 0 ? (
          events.map((event) => (
            <div className="event_card" key={event.id}>
              <p className="event_card_text">{event.title}</p>
              <p>
                <span className="event_card_text">From: </span>
                {moment(event.start).format(defaultDateTimeFormat)}
              </p>
              <p>
                <span className="event_card_text">To: </span>
                {moment(event.end).format(defaultDateTimeFormat)}
              </p>
              <Button onClick={() => deleteEvent(event.id)} variant="danger">
                Remove
              </Button>
            </div>
          ))
        ) : (
          <div className="no_data_message">Nema podataka</div>
        )}
      </ul>
    </div>
  );
}

export default EventsList;

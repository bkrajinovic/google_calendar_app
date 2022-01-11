import React, { useEffect } from "react";
import moment from "moment";
import { defaultTimeFormat } from "constants";
import { Spinner, Button, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import "./styles.css";

function EventsList({
  isLoadingEvents,
  groupedEvents,
  getEvents,
  deleteEvent,
}) {
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
    <div className="events_list_wrapper">
      {groupedEvents && groupedEvents.length > 0 ? (
        groupedEvents.map((group, index) => {
          return (
            <div key={index} className="group_list">
              <p>{group.date}</p>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                {group.events.map((event, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{event.title}</td>
                      <td>{moment(event.start).format(defaultTimeFormat)}</td>
                      <td>{moment(event.end).format(defaultTimeFormat)}</td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          onClick={() => deleteEvent(event.id)}
                          variant="danger"
                        >
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </Table>
            </div>
          );
        })
      ) : (
        <div className="no_data_message">Nema podataka</div>
      )}
    </div>
  );
}

export default EventsList;

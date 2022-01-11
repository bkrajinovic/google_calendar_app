import React, { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import EventsList from "./components/EventsList/EventsList";
import Header from "components/Header/Header";
import AddEventModal from "components/AddEventModal/AddEventModal";
import localforage from "localforage";
import api from "helpers/api";
import { filterDateTimeFormat } from "./constants";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

function App() {
  const API_KEY = "AIzaSyDuHD2xWRSbr1hSUtRfo-4Z63NSF5vfCh0";

  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localforage.getItem("access_token").then((token) => {
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleTimeFilter = (value) => {
    const timeFilter = `&timeMax=${moment().format(
      filterDateTimeFormat
    )}&timeMin=${moment()
      .subtract(value, "days")
      .format(filterDateTimeFormat)}`;
    getEvents(timeFilter);
  };

  const formatEvents = (list) => {
    return list.map((item) => ({
      id: item.id,
      title: item.summary,
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
    }));
  };

  const deleteEvent = (eventId) => {
    console.log(eventId);
    api
      .delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?key=${API_KEY}`
      )
      .then((data) => {
        console.log("dataDelete", data);
      })
      .catch((err) => {
        setIsLoadingEvents(false);
        console.log("err", err);
      });
  };

  const getEvents = (filters = "") => {
    if (!filters) {
      filters += `&timeMax=${moment().format(
        filterDateTimeFormat
      )}&timeMin=${moment().subtract(7, "days").format(filterDateTimeFormat)}`;
    }
    api
      .get(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${API_KEY}&orderBy=startTime&singleEvents=true${filters}`
      )
      .then((data) => {
        setIsLoadingEvents(false);
        if (data?.data?.items) {
          setEvents(formatEvents(data.data.items));
        }
      })
      .catch((err) => {
        setIsLoadingEvents(false);
        console.log("err", err);
      });
  };

  return (
    <div>
      {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} />}
      {isLoggedIn && (
        <div className="app_wrapper">
          {isModalOpen && (
            <AddEventModal
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
              getEvents={getEvents}
              API_KEY={API_KEY}
            />
          )}
          <Header
            handleTimeFilter={handleTimeFilter}
            setIsModalOpen={setIsModalOpen}
          />
          <EventsList
            events={events}
            isLoadingEvents={isLoadingEvents}
            getEvents={getEvents}
            deleteEvent={deleteEvent}
          />
        </div>
      )}
    </div>
  );
}

export default App;

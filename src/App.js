import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { filterDateTimeFormat, defaultDateFormat } from "./constants";
import moment from "moment";
import localforage from "localforage";
import api from "helpers/api";

import Login from "./components/Login/Login";
import EventsList from "./components/EventsList/EventsList";
import Header from "components/Header/Header";
import AddEventModal from "components/AddEventModal/AddEventModal";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({name: "Last 7 days", value: 7 });
  const [groupedEvents, setGroupedEvents] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (events && events.length) {
      if (currentFilter.name !== "Last 30 days") {
        const groups = events.reduce((groups, event) => {
          const date = moment(event.start).format(defaultDateFormat);
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(event);
          return groups;
        }, {});

        const groupArrays = Object.keys(groups).map((date) => {
          return {
            date,
            events: groups[date],
          };
        });
        setGroupedEvents(groupArrays);
      } else {
        const groups = events.reduce((groups, event) => {
          const weekNumber = moment(event.start).week();
          if (!groups[weekNumber]) {
            groups[weekNumber] = [];
          }
          groups[weekNumber].push(event);
          return groups;
        }, {});

        const groupArrays = Object.keys(groups).map((week) => {
          return {
            date: `Week ${week}`,
            events: groups[week],
          };
        });
        setGroupedEvents(groupArrays);
      }
    } else {
      setGroupedEvents([]);
    }
  }, [events]);

  useEffect(() => {
    localforage.getItem("access_token").then((token) => {
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleTimeFilter = (filter) => {
    setIsLoadingEvents(true);
    const timeFilter = `&timeMax=${moment().format(
      filterDateTimeFormat
    )}&timeMin=${moment()
      .subtract(filter.value, "days")
      .format(filterDateTimeFormat)}`;
    getEvents(timeFilter);
    setCurrentFilter(filter);
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
    setIsLoadingEvents(true);
    api
      .delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?key=${process.env.REACT_APP_API_KEY}`
      )
      .then(() => {
        handleTimeFilter(currentFilter);
      })
      .catch(() => {
        setIsLoadingEvents(false);
        toast.error("Something went wrong while deleting event");
      });
  };

  const getEvents = (filters = "") => {
    setIsLoadingEvents(true);
    if (!filters) {
      filters += `&timeMax=${moment().format(
        filterDateTimeFormat
      )}&timeMin=${moment().subtract(7, "days").format(filterDateTimeFormat)}`;
    }
    api
      .get(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${process.env.REACT_APP_API_KEY}&orderBy=startTime&singleEvents=true${filters}`
      )
      .then((data) => {
        setIsLoadingEvents(false);
        if (data?.data?.items) {
          setEvents(formatEvents(data.data.items));
        }
      })
      .catch(() => {
        setIsLoadingEvents(false);
        toast.error("Something went wrong while fetching events");
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
              handleTimeFilter={handleTimeFilter}
              currentFilter={currentFilter}
            />
          )}
          <Header
            handleTimeFilter={handleTimeFilter}
            setIsModalOpen={setIsModalOpen}
          />
          <p className="range_text">{currentFilter.name}:</p>
          <EventsList
            groupedEvents={groupedEvents}
            isLoadingEvents={isLoadingEvents}
            getEvents={getEvents}
            deleteEvent={deleteEvent}
            currentFilter={currentFilter}
          />
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

export default App;

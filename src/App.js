import React, { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import EventsList from "./components/EventsList/EventsList";
import Header from "components/Header/Header";
import AddEventModal from "components/AddEventModal/AddEventModal";
import localforage from "localforage";
import api from "helpers/api";
import { filterDateTimeFormat, defaultDateFormat } from "./constants";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

function App() {
  const API_KEY = "AIzaSyDuHD2xWRSbr1hSUtRfo-4Z63NSF5vfCh0";

  const [events, setEvents] = useState([]);
  const [filterDays, setFilterDays] = useState("Last 7 days");
  const [groupedEvents, setGroupedEvents] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (events && events.length) {
      if (filterDays !== "Last 30 days") {
        const groups = events.reduce((groups, event) => {
          const date = moment(event.start).format(defaultDateFormat);
          console.log(groups[date]);
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
          console.log(groups[weekNumber]);
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

        console.log("groupArrays", groupArrays);
        setGroupedEvents(groupArrays);
      }
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

  const handleTimeFilter = (day) => {
    setIsLoadingEvents(true);
    setFilterDays(day.name);
    const timeFilter = `&timeMax=${moment().format(
      filterDateTimeFormat
    )}&timeMin=${moment()
      .subtract(day.value, "days")
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
    setIsLoadingEvents(true);
    api
      .delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?key=${API_KEY}`
      )
      .then(() => {
        getEvents();
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
          <p className="range_text">{filterDays}:</p>
          <EventsList
            groupedEvents={groupedEvents}
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

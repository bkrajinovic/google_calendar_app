import localforage from "localforage";
import React from "react";
import Button from "react-bootstrap/Button";
import { Dropdown } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";
import "./styles.css";

function Header({ handleTimeFilter, setIsModalOpen }) {
  const handleLogout = () => {
    localforage.removeItem("access_token").then(() => {
      window.location.reload();
    });
  };

  const dayFilters = [
    { name: "Last 24 hours", value: 1 },
    { name: "Last 7 days", value: 7 },
    { name: "Last 30 days", value: 30 },
  ];

  return (
    <div className="header">
      <div className="content_left">
        <Calendar />
        <p>Calendar list App</p>
      </div>
      <div className="content_right">
        <Dropdown className="d-inline">
          <Dropdown.Toggle id="dropdown-autoclose-true">
            Select time range
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {dayFilters.map((value, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleTimeFilter(value)}
              >
                {value.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button onClick={() => setIsModalOpen(true)} style={{ marginRight: '20px' }}variant="success mr-20">
          Add new event
        </Button>
        <Button onClick={() => handleLogout()} variant="outline-primary">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;

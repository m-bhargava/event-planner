import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, TextField, Card, CardContent } from "@mui/material";
import "./styles.css";

const API_KEY = "ZYqjTOaWmJDJlCJf927LLwKqZAYUorsj"; // Ticketmaster API Key

function App() {
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");

    const params = {
      apikey: API_KEY,
      size: 10,
    };
    if (city) params.city = city;
    if (keyword) params.keyword = keyword;

    try {
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events.json`,
        { params }
      );

      if (response.data._embedded) {
        setEvents(response.data._embedded.events);
      } else {
        setEvents([]);
        setError("No events found.");
      }
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="container mt-5 p-4"
      style={{
        background: "linear-gradient(45deg, rgb(181, 181, 181), #65727f)",
        minHeight: "100vh",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h2 className="text-center mb-4 text-white">🎉 Event Planner</h2>

      <TextField
  fullWidth
  label={<span className="custom-label">Enter city name</span>}
  variant="outlined"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  className="mb-3"
/>
<TextField
  fullWidth
  label={<span className="custom-label">Enter keyword</span>}
  variant="outlined"
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  className="mb-3"
/>

<Button variant="contained" className="search-button" onClick={fetchEvents}>
  Search Events
</Button>

      {loading && <p className="text-center text-white mt-3">Loading events...</p>}
      {error && <p className="text-center text-danger mt-3">{error}</p>}

      <div className="row mt-4">
        {events.map((event) => (
          <div className="col-md-4 mb-4" key={event.id}>
            <Card className="card-custom">
  {event.images && (
    <img src={event.images[0].url} className="card-img-top" alt={event.name} />
  )}
  <CardContent>
    <h5 className="text-dark">{event.name}</h5>
    <p className="text-dark">{event.dates.start.localDate}</p>
    <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn view-button">
      View Details
    </a>
  </CardContent>
</Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

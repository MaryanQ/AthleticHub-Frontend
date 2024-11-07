import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import ParticipantList from "./components/ParticipantList";
import ParticipantForm from "./form/ParticipantForm";
import ParticipantDetails from "./components/ParticipantDetails";
import Results from "./components/Results";
import Disciplines from "./components/Disciplines";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Main participant list view */}
          <Route path="/" element={<ParticipantList />} />

          {/* Routes for participant operations */}
          <Route path="/participants" element={<ParticipantList />} />
          <Route path="/participants/new" element={<ParticipantForm />} />
          <Route path="/participants/:id/edit" element={<ParticipantForm />} />
          <Route path="/participants/:id" element={<ParticipantDetails />} />

          {/* Routes for results and disciplines */}
          <Route path="/results" element={<Results />} />
          <Route path="/disciplines" element={<Disciplines />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import ParticipantList from "./components/ParticipantList";
import ParticipantDetails from "./components/ParticipantDetails";
import Results from "./components/Results";
import Disciplines from "./components/Disciplines";
import CreateParticipantForm from "./form/CreateParticipantForm"; // Updated import for creating a participant
import EditParticipantForm from "./form/EditParticipantForm"; // Updated import for editing a participant
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<ParticipantList />} />
          <Route path="/participants" element={<ParticipantList />} />
          <Route
            path="/participants/new"
            element={<CreateParticipantForm />}
          />{" "}
          {/* Route for adding a new participant */}
          <Route path="/participants/:id" element={<ParticipantDetails />} />
          <Route
            path="/edit-participant/:id"
            element={<EditParticipantForm />}
          />{" "}
          {/* Route for editing a participant */}
          <Route path="/results" element={<Results />} />
          <Route path="/disciplines" element={<Disciplines />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

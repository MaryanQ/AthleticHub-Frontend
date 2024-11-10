import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import ParticipantList from "./components/ParticipantList";
import ParticipantDetails from "./components/ParticipantDetails";
import Results from "./components/Results";
import DisciplineList from "./components/DisciplineList"; // Renamed for clarity
import AddDiscipline from "./forms/AddDiscipline";
import EditDiscipline from "./forms/EditDiscipline"; // Renamed for clarity

import "./App.css";
import AddParticipantForm from "./forms/AddParticipant";
import EditParticipantForm from "./forms/EditParticipantForm";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<ParticipantList />} />
          <Route path="/participants" element={<ParticipantList />} />
          <Route path="/participants/:id" element={<ParticipantDetails />} />
          <Route path="/participants/new" element={<AddParticipantForm />} />
          <Route
            path="/edit-participant/:id"
            element={<EditParticipantForm />}
          />
          <Route path="/results" element={<Results />} />

          {/* Discipline routes */}
          <Route path="/disciplines" element={<DisciplineList />} />
          <Route path="/disciplines/add" element={<AddDiscipline />} />
          <Route path="/disciplines/edit/:id" element={<EditDiscipline />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

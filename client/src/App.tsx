import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import ParticipantList from "./components/ParticipantList";
import ParticipantDetails from "./components/ParticipantDetails";
import ResultList from "./components/ResultsList";
import DisciplineList from "./components/DisciplineList";
import AddDiscipline from "./forms/AddDiscipline";
import EditDiscipline from "./forms/EditDiscipline";
import HomePage from "./layout/HomePage";
import AddParticipantForm from "./forms/AddParticipant";
import EditParticipantForm from "./forms/EditParticipantForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login"; // Import login component

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} /> {/* Add Login Route */}
          {/* Protected Routes */}
          <Route
            path="/participants"
            element={
              <ProtectedRoute>
                <ParticipantList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participants/:id"
            element={
              <ProtectedRoute>
                <ParticipantDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participants/new"
            element={
              <ProtectedRoute>
                <AddParticipantForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-participant/:id"
            element={
              <ProtectedRoute>
                <EditParticipantForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplines"
            element={
              <ProtectedRoute>
                <DisciplineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplines/add"
            element={
              <ProtectedRoute>
                <AddDiscipline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplines/edit/:id"
            element={
              <ProtectedRoute>
                <EditDiscipline />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

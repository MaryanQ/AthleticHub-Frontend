// ResultList.tsx
import React, { useEffect, useState } from "react";
import { getAllResults, deleteResult } from "../service/apiFacade";
import { Result } from "../type/Result";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ResultList.css"; // Assume you have a CSS file for styling

const ResultList: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getAllResults();
      setResults(data);
    } catch (error) {
      console.error("Failed to load results:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResult(id);
      setResults((prev) => prev.filter((result) => result.id !== id));
    } catch (error) {
      console.error("Failed to delete result:", error);
    }
  };

  return (
    <div className="container">
      <h2>Results</h2>
      <ul className="result-list">
        {results.map((result) => (
          <li key={result.id}>
            <span>
              Date: {result.date} - Value: {result.resultValue} - Type:{" "}
              {result.resultType} - Discipline: {result.discipline?.name}
            </span>
            <div className="result-actions">
              <button onClick={() => navigate(`/results/edit/${result.id}`)}>
                Edit
              </button>
              <button onClick={() => handleDelete(result.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="button-container">
        <Link to="/results/add">
          <button>Add Result</button>
        </Link>
      </div>
    </div>
  );
};

export default ResultList;

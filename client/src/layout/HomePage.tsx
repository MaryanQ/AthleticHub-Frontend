import React from "react";
import "../styles/HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <div className="banner">
        <img
          src="/52161164632_9bfee1b981_k.jpg" // Make sure this image path is correct
          alt="Athletics Banner"
          className="banner-image"
        />
        <div className="overlay">
          <h1>Welcome to AthleticHub</h1>
          <p>
            Your ultimate destination for tracking athletic events,
            participants, and results.
          </p>
          <button className="cta-button">Join Now</button>
        </div>
      </div>
      <section className="content-section">
        <h2>About AthleticHub</h2>
        <p>
          AthleticHub is your go-to platform for managing athletic events,
          tracking participants, and monitoring results. Whether you're an
          athlete, coach, or event organizer, AthleticHub provides the tools you
          need to stay on top of your athletic goals.
        </p>
      </section>
    </div>
  );
};

export default HomePage;

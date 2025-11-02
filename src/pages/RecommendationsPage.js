import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecommendationsPage.css";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch("http://localhost:8080/api/recommendations");
      const data = await res.json();
      setRecommendations(data);
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="recommendations-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h2>Recommended Destinations for You 🌍</h2>

      <div className="recommendations-grid">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="recommendation-card">
            <img src={rec.imageUrl} alt={rec.place} />
            <h3>{rec.place}</h3>
            <p>{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;

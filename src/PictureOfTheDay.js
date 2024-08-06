import { useEffect, useState } from "react";
import { TextExpander } from "./TextExpander";
const apiKey = "mtoa11z489I5gp23c9snLvm6HYmByNu2PklwCzU8";

export default function PictureOfTheDay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="app-container">
      <h1 className="app-title">{data.title}</h1>
      <p className="app-date">{data.date}</p>
      <TextExpander className="app-explanation">
        {data.explanation}
      </TextExpander>
      {data.media_type === "image" ? (
        <img className="app-image" src={data.url} alt={data.title} />
      ) : (
        <div className="app-video">
          <iframe
            src={data.url}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
          ></iframe>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = "mtoa11z489I5gp23c9snLvm6HYmByNu2PklwCzU8";
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
      <PeopleInSpace />
    </div>
  );
}

function TextExpander({
  collapsedNumWords = 15,
  expandButtonText = "show more",
  collapseButtonText = "show less",
  expanded = false,
  className,
  children,
}) {
  const [exp, setExpanded] = useState(expanded);

  const collapsString = children
    .split(" ")
    .filter((word, i) => collapsedNumWords >= i + 1)
    .join(" ");

  return (
    <div className={className}>
      {exp ? children : collapsString + "..."}
      <button
        className="text-expander-button"
        onClick={() => setExpanded(!exp)}
      >
        {exp ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}

function PeopleInSpace() {
  const [data, setData] = useState({ people: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  console.log(data);

  useEffect(() => {
    async function fetchData() {
      if (!showPeople) return;
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://api.open-notify.org/astros.json");
        if (!res.ok) throw new Error("Fetching people in space went wrong");
        const data = await res.json();
        setData(data);
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [showPeople]);

  function handleShowPople() {
    setShowPeople((showPeople) => !showPeople);
  }

  if (loading) return <p className="loading">Loading people in space...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <>
      {!showPeople ? (
        <h1 className="clickable-header" onClick={handleShowPople}>
          See how many people currently on space🚀!!
        </h1>
      ) : (
        <div className="people-in-space">
          <span className="hide-button" onClick={handleShowPople}>
            Close
          </span>
          <h2>People Currently in Space</h2>
          <p className="people-count">
            There {data.people?.length === 1 ? "is" : "are"} currently{" "}
            {data.people.length}{" "}
            {data.people.length === 1 ? "person" : "people"} in space.
          </p>

          {data && data.people.length > 0 ? (
            <ul>
              {data.people.map((person, index) => (
                <li key={index}>
                  {person.name} aboard {person.craft}
                </li>
              ))}
            </ul>
          ) : (
            <p>No one is currently in space.</p>
          )}
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import EmotionButtons from "./components/EmotionButtons";
import axios from "axios";
import "./App.css";
import JarScene from "./components/JarScene";



function App() {
  const [selectedShlok, setSelectedShlok] = useState(null);

  const handleSelect = async (emotion) => {
    try {
      const response = await axios.get("/api/shloks/random");
      const shloks = response.data;
      const shlok = shloks[emotion]?.[0]; // get one shlok for that emotion

      if (shlok) {
        setSelectedShlok(shlok);
      } else {
        setSelectedShlok({ shlok: "No shlok found for this emotion." });
      }
    } catch (error) {
      console.error("Error fetching shlok:", error);
      setSelectedShlok({ shlok: "Error fetching shlok." });
    }
  };

 return (
  <div
    style={{
      textAlign: "center",
      marginTop: "50px",
      
      backgroundSize: "cover",
      minHeight: "100vh",
      padding: "20px",
      color: "#fff"
    }}
  >
    <h1>Read me When</h1>

    {/* 👇 Show 3D Jar */}
    <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
      <JarScene shlokTriggered={selectedShlok} />
    </div>

    <EmotionButtons onSelect={handleSelect} />

    {selectedShlok && (
      <div className="shlok-box">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>
            <strong>Chapter:</strong> {selectedShlok.chapter}
          </h2>
          <h2 style={{ marginLeft: "10px" }}>
            <strong>Shlok:</strong> {selectedShlok.verse}
          </h2>
        </div>
        <p>
          <strong>Original:</strong> {selectedShlok.shlok}
        </p>
        <p>
          <strong>Translation:</strong> {selectedShlok.translation}
        </p>
        <p>
          <strong>Meaning:</strong> {selectedShlok.meaning}
        </p>
        <button
          onClick={(e) => {
            const message = e.currentTarget.nextElementSibling;
            message.style.display =
              message.style.display === "none" ? "block" : "none";
          }}
        >
          Message
        </button>
        <p style={{ display: "none" }}>
          <strong>Message:</strong> {selectedShlok.message}
        </p>
      </div>
    )}
  </div>
);

}

export default App;

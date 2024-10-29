import React, { useRef, useState, useEffect } from 'react';
import s from './assets/s.mp3'

function App() {
  const audioRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [frequencyData, setFrequencyData] = useState([]);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (audioContext && analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateStats = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Oblicz intensywność dźwięku (średnia wartość z danych częstotliwości)
        const avgIntensity = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setIntensity(avgIntensity.toFixed(2));

        // Aktualizuj dane częstotliwości
        setFrequencyData([...dataArray]);
        requestAnimationFrame(updateStats);
      };
      updateStats();
    }
  }, [audioContext, analyser]);

useEffect(() => {


}, [])

  const handleFileUpload = (e) => {
      audioRef.current.src = s;

      const context = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = context.createMediaElementSource(audioRef.current);
      const newAnalyser = context.createAnalyser();
      audioSource.connect(newAnalyser);
      newAnalyser.connect(context.destination);

      newAnalyser.fftSize = 256;  // Można dostosować FFT do pożądanej rozdzielczości
      setAudioContext(context);
      setAnalyser(newAnalyser);
      audioRef.current.play()
  };

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "99vw"}}>
      <h1>Projekt na fizykę: Krystian Niemczyk</h1>
      <h2>Analiza pliku audio</h2>
      <input type="button" accept="audio/*" value={"Start"} onClick={handleFileUpload} />
      <audio ref={audioRef} controls />
      
      <div style={{ width: "80vw", marginTop: "20px" }}>

      </div>
      
      <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
        <h3>Natężenie dźwięku: {intensity}</h3>
        <h3>Analiza częstotliwości:</h3>
        <div style={{ display: 'flex', gap: '2px', height: "300px" }}>
          {frequencyData.map((value, index) => (
            <div
              key={index}
              style={{
                background: 'blue',
                width: '2px',
                height: `${value}px`
              }}
            ></div>
          ))}
        </div>
      </div>
      <div style={{width: "80vw"}}>
        <h1>Zrozumienie Dźwięku i Wizualizacji Audio</h1>
        <p>Dźwięk jest falą mechaniczną, która rozchodzi się przez powietrze (lub inne media), tworząc oscylacje jako obszary wysokiego i niskiego ciśnienia. Te oscylacje wywołują drgania, które odbieramy jako dźwięk. Fale dźwiękowe różnią się częstotliwością (wysokością tonu) oraz amplitudą (głośnością), co można wizualizować, aby lepiej zrozumieć właściwości dźwięku, który słyszymy.</p>
        <p><b>Jak działa wizualizacja dźwięku?</b></p>
        <p>Wizualizacja dźwięku polega na przekształcaniu danych z analizatora audio na obrazy, które reprezentują zmiany w amplitudzie i częstotliwości dźwięku w czasie.</p>
        <p><b>Częstotliwość</b></p>
        <p><b>Po lewej stronie możemy zobaczyć jak zachowują się niskie częstotliwości 20hz+, a po prawej wysokie</b></p>
      </div>
    </div>
  );
}

export default App;

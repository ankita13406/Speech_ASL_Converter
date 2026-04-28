


import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a1628 0%, #0d2247 30%, #0f3460 60%, #1a5276 100%);
    font-family: 'DM Sans', sans-serif;
    color: #e8f0fe;
  }

 .app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;   /* ✅ keeps cards centered */
  padding: 48px 24px;
  position: relative;
  overflow-x: auto;      /* ✅ allows full view if very large */
}

  .app::before {
    content: '';
    position: fixed;
    top: -30%;
    left: -20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(ellipse, rgba(56, 139, 253, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .app::after {
    content: '';
    position: fixed;
    bottom: -20%;
    right: -10%;
    width: 50%;
    height: 50%;
    background: radial-gradient(ellipse, rgba(26, 188, 254, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .header-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #63b3ed;
    margin-bottom: 12px;
  }

  .header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 800;
    letter-spacing: -1px;
    background: linear-gradient(120deg, #ffffff 20%, #93c5fd 60%, #38bdf8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  .header-line {
    width: 48px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #38bdf8);
    margin: 16px auto 0;
    border-radius: 2px;
  }

  .card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;

  width: fit-content;        /* ✅ expand based on content */
  min-width: 640px;          /* ✅ keep normal size for small words */
  max-width: 95vw;           /* ✅ prevent going outside screen */

  backdrop-filter: blur(12px);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

  .card-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #60a5fa;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-label::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3b82f6;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22d3ee;
    box-shadow: 0 0 8px #22d3ee;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .live-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 22px;
    font-weight: 300;
    color: #bfdbfe;
    min-height: 34px;
    line-height: 1.4;
  }

  .live-text.placeholder {
    color: rgba(148, 163, 184, 0.4);
    font-style: italic;
    font-size: 16px;
  }

  .current-word {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 6px;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    min-height: 48px;
    text-align: center;
  }

  .gesture-grid {
  display: flex;
  justify-content: center;
  gap: 14px;

  flex-wrap: nowrap;         /* ❌ no wrapping */
  
  margin-top: 4px;
  min-height: 120px;
  align-items: center;
}

  .gesture-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(99, 179, 237, 0.2);
    border-radius: 14px;
    padding: 6px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .gesture-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(56, 189, 248, 0.15);
  }

  .gesture-card img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }

  .gesture-empty {
    color: rgba(148, 163, 184, 0.3);
    font-size: 13px;
    letter-spacing: 1px;
    font-style: italic;
  }

  .btn-row {
    display: flex;
    justify-content: center;
    margin-bottom: 36px;
    position: relative;
    z-index: 1;
  }

  .btn {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    padding: 14px 40px;
    border-radius: 100px;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-start {
    background: linear-gradient(135deg, #2563eb, #0ea5e9);
    color: #fff;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  }

  .btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37, 99, 235, 0.55);
  }

  .btn-start:active { transform: translateY(0); }

  .btn-stop {
    background: rgba(255,255,255,0.07);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.35);
    box-shadow: 0 0 20px rgba(248,113,113,0.08);
  }

  .btn-stop:hover {
    background: rgba(248,113,113,0.1);
    border-color: #f87171;
    transform: translateY(-2px);
  }

  .recording-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #f87171;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }
`;

function App() {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [visibleLetters, setVisibleLetters] = useState([]);

  const queueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const processedWordsRef = useRef([]);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => { console.log("Connected"); });
    socket.on("text", handleIncomingText);
    return () => { socket.off("text", handleIncomingText); };
  }, []);

  const startRecording = async () => {
    try {
      setText("");
      processedWordsRef.current = [];
      queueRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      streamRef.current = stream;
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      await audioContext.audioWorklet.addModule("/audioProcessor.js");
      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, "audio-processor");
      processorRef.current = workletNode;
      source.connect(workletNode);

      workletNode.port.onmessage = (event) => {
        const buffer = event.data;
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        socket.emit("audio", base64);
      };

      socket.emit("start");
      setRecording(true);
    } catch (err) {
      console.error("Start error:", err);
    }
  };

  const stopRecording = () => {
    try {
      if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
      if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      socket.emit("stop");
      setRecording(false);
    } catch (err) {
      console.error("Stop error:", err);
    }
  };

  const handleIncomingText = (incoming) => {
    setText(incoming);
    const words = incoming.trim().split(" ").filter(w => w);
    const newWords = words.slice(processedWordsRef.current.length);
    processedWordsRef.current = words;
    newWords.forEach(word => { if (word.length > 1) queueRef.current.push(word); });
    processQueue();
  };

  const processQueue = async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    while (queueRef.current.length > 0) {
      const word = queueRef.current.shift();
      await playWord(word);
      await new Promise(res => setTimeout(res, 500));
    }
    isPlayingRef.current = false;
  };

  const playWord = async (word) => {
    const upper = word.toUpperCase();
    setCurrentWord(upper);
    let displayed = [];
    for (let i = 0; i < upper.length; i++) {
      const letter = upper[i];
      if (letter.match(/[A-Z]/)) {
        displayed.push(`${letter}.png`);
        setVisibleLetters([...displayed]);
        await new Promise(res => setTimeout(res, 600));
      }
    }
    await new Promise(res => setTimeout(res, 1200));
    setVisibleLetters([]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <p className="header-label">Real-time translation</p>
          <h1>Voice to Sign Language</h1>
          <div className="header-line" />
        </div>

        <div className="btn-row">
          {!recording ? (
            <button className="btn btn-start" onClick={startRecording}>Start Recording</button>
          ) : (
            <button className="btn btn-stop" onClick={stopRecording}>Stop Recording</button>
          )}
        </div>

        {recording && (
          <div className="recording-badge">
            <div className="live-dot" />
            Live
          </div>
        )}

        <div className="card">
          <div className="card-label">
            {recording && <div className="live-dot" style={{ marginRight: 4 }} />}
            Transcription
          </div>
          <p className={`live-text${!text ? " placeholder" : ""}`}>
            {text || "Start speaking to see transcription..."}
          </p>
        </div>

        <div className="card">
          <div className="card-label">Current Word</div>
          <div className="current-word">{currentWord || "\u00A0"}</div>
        </div>

        <div className="card">
          <div className="card-label">Gesture Output</div>
          <div className="gesture-grid">
            {visibleLetters.length > 0 ? (
              visibleLetters.map((img, idx) => (
                <div className="gesture-card" key={idx}>
                  <img src={`/signs/${img}`} alt={img.replace(".png", "")} />
                </div>
              ))
            ) : (
              <span className="gesture-empty">Gestures will appear here</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

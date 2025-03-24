require("dotenv").config();
const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const STREAM_KEY = "sy5h-4f76-t0ah-bmsf-fav9"; // YouTube Stream Key
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
const VIDEO_PATH = path.join(__dirname, "pp1.mp4"); // Local video file ka path
const SCORE_FILE = path.join(__dirname, "score.txt");
const API_KEY = process.env.CRIC_API_KEY;
const API_URL = `https://api.cricapi.com/v1/cricScore?apikey=${API_KEY}`;

// Function to fetch and update score
async function updateScore() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data && data.data && data.data.length > 0) {
            // Pehle check karenge ki `match.t1` aur `match.t2` exist karte hain ya nahi
            const match = data.data.find(m => 
                m.t1 && m.t2 && 
                ((m.t1.includes("Delhi Capitals") && m.t2.includes("Lucknow Super Giants")) ||
                 (m.t1.includes("Lucknow Super Giants") && m.t2.includes("Delhi Capitals")))
            );

            if (match) {
                let scoreText = `🏏 ${match.series}\n${match.t1} vs ${match.t2}\n`;
                scoreText += `📍 ${match.status}\n`;

                if (match.t1s || match.t2s) {
                    scoreText += `🔹 ${match.t1}: ${match.t1s || "Yet to bat"}\n`;
                    scoreText += `🔹 ${match.t2}: ${match.t2s || "Yet to bat"}\n`;
                } else {
                    scoreText += "Match not started\n";
                }

                // Score file update karo
                fs.writeFileSync(SCORE_FILE, `IPL Live Score:\n${scoreText}`);
                console.log("Score updated:\n", scoreText);
            } else {
                console.log("DC vs LSG ka match nahi mila.");
            }
        } else {
            console.log("Koi live match nahi mila.");
        }
    } catch (error) {
        console.error("Score fetch karne me error:", error.message);
    }
}

// Har 30 sec me score update hoga


// Function to start streaming
function startStreaming() {
    const ffmpeg = spawn("ffmpeg", [
        "-stream_loop", "-1",
        "-re",
        "-i", VIDEO_PATH,
        "-vf", `drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':textfile=score.txt:x=10:y=50:fontsize=40:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:reload=1`,
        "-c:v", "libx264",
        "-preset", "ultrafast",    // ✅ Lower CPU Usage
        "-b:v", "4500k",          // ✅ Higher Bitrate for Smooth Streaming
        "-maxrate", "5000k",      // ✅ Avoid Bitrate Drops
        "-bufsize", "10000k",     // ✅ Prevent Buffering
        "-g", "60",               // ✅ Improve Keyframe Interval
    
        // ✅ Audio Fix
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-ac", "2",      // ✅ Stereo Audio (L/R Channels)
        "-f", "flv", `${RTMP_URL}/${STREAM_KEY}`
    ]);

    ffmpeg.stdout.on("data", (data) => console.log(`STDOUT: ${data}`));
    ffmpeg.stderr.on("data", (data) => console.error(`STDERR: ${data}`));
    ffmpeg.on("close", (code) => console.log(`Process exited with code ${code}`));
}

// Express Server
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/start-stream", (req, res) => {
  
    startStreaming();
    res.send("Live stream started!");
});

app.get("/", (req, res) => {
    setInterval(updateScore, 1500);
    updateScore();
    res.send("Live Stream Running!");
});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
     // Auto start on Railway
});

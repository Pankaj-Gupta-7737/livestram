require("dotenv").config();
const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const STREAM_KEY = "sy5h-4f76-t0ah-bmsf-fav9"; // YouTube Stream Key
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
const VIDEO_PATH = path.join(__dirname, "pp.mp4"); // Local video file ka path
const SCORE_FILE = path.join(__dirname, "score.txt");
const API_URL = "https://api.cricapi.com/v1/cricScore?apikey=e29b5bb4-5bdf-4715-8434-70e73a3e5717";

// Function to fetch and update score
async function updateScore() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data && data.data.length > 0) {
            // DC vs LSG match dhoondhne ke liye filter
            const match = data.data.find(m => m.teams.includes("Delhi Capitals") && m.teams.includes("Lucknow Super Giants"));

            if (match) {
                let scoreText = `${match.teams[0]} vs ${match.teams[1]}\n`;
                scoreText += `${match.status}\n`;

                if (match.score.length > 0) {
                    match.score.forEach(s => {
                        scoreText += `${s.inning}: ${s.r}/${s.w} (${s.o} Overs)\n`;
                    });
                }

                // Score file update karo
                fs.writeFileSync(SCORE_FILE, `IPL Live Score:\n${scoreText}`);
                console.log("Score updated:", scoreText);
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
setInterval(updateScore, 30000);
updateScore();

// Function to start streaming
function startStreaming() {
    const ffmpeg = spawn("ffmpeg", [
        "-stream_loop", "-1",
        "-re",
        "-i", VIDEO_PATH,
        "-vf", "drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':textfile=score.txt:x=10:y=50:fontsize=24:fontcolor=white:reload=1",
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
    res.send("Live Stream Running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
     // Auto start on Railway
});

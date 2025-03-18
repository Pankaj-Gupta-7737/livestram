require("dotenv").config();
const { spawn } = require("child_process");
const express = require("express");
const path = require("path");

const STREAM_KEY = "sy5h-4f76-t0ah-bmsf-fav9";  // YouTube Stream Key
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
const VIDEO_PATH = path.join(__dirname, "pp.mp4");  // Local video file ka path

function startStreaming() {
    // const ffmpeg = spawn("ffmpeg", [
    //     "-stream_loop", "-1",  // Infinite loop
    //     "-re",  // Real-time mode
    //     "-i", VIDEO_PATH, // Input video file
    //     "-c:v", "libx264",
    //     "-preset", "fast",
    //     "-b:v", "2500k",
    //     "-maxrate", "1500k",
    //     "-bufsize", "5000k",
    //     "-g", "60",
    //     "-c:a", "aac",
    //     "-b:a", "128k",// Lower audio bitrate
    //     "-ar", "44100",
    //     "-f", "flv", `${RTMP_URL}/${STREAM_KEY}`
    // ]);
    const ffmpeg = spawn("ffmpeg", [
        "-stream_loop", "-1",
        "-re",
        "-i", VIDEO_PATH,
        "-c:v", "libx264",
        "-preset", "fast",
        "-b:v", "2500k",
        "-maxrate", "2500k",
        "-bufsize", "5000k",
        "-g", "60",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-f", "flv", "rtmp://a.rtmp.youtube.com/live2/sy5h-4f76-t0ah-bmsf-fav9"
    ]);
    ffmpeg.stdout.on("data", (data) => console.log(`STDOUT: ${data}`));
    ffmpeg.stderr.on("data", (data) => console.error(`STDERR: ${data}`));
    ffmpeg.on("close", (code) => console.log(`Process exited with code ${code}`));
}

// Express Server
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/start-stream", (req, res) => {
    startStreaming();
    res.send("Live stream started!");
});
app.get("/", (req, res) => {
    res.send("Live Stream Running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// require("dotenv").config();
// const { spawn } = require("child_process");
// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const axios = require("axios");

// const STREAM_KEY = "sy5h-4f76-t0ah-bmsf-fav9"; // YouTube Stream Key
// const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";
// const VIDEO_PATH = path.join(__dirname, "pp1.mp4"); // Local video file ka path
// const SCORE_FILE = path.join(__dirname, "score.txt");
// const API_KEY = process.env.CRIC_API_KEY;
// const API_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;
// const TARGET_MATCH_ID = "c6e97609-d9c1-46eb-805a-e282b34f3bb1";

// // ✅ Function to fetch and update score
// async function updateScore() {
//     try {
//         const response = await axios.get(API_URL);
//         const data = response.data;

//         if (!data || !data.data || data.data.length === 0) {
//             console.log("⛔ No live match found.");
//             return;
//         }

//         const match = data.data.find(m => m.id === TARGET_MATCH_ID);

//         if (!match) {
//             console.log("⛔ Specified match ID ka match nahi mila.");
//             return;
//         }

//         let scoreText = `Match: ${match.name}\n`;
//         scoreText += `Venue: ${match.venue}\n`;
//         scoreText += `Date: ${match.date}\n`;
//         scoreText += `Status: ${match.status}\n`;

//         if (match.score && match.score.length > 0) {
//             match.score.forEach(inning => {
//                 scoreText += `${inning.inning} - ${inning.r}/${inning.w} (${inning.o} overs)\n`;
//             });
//         } else {
//             scoreText += "Match not started yet.\n";
//         }

//         fs.writeFileSync(SCORE_FILE, scoreText);
//         console.log("✅ Score updated:\n", scoreText);

//     } catch (error) {
//         console.error("❌ Error fetching score:", error.message);
//     }
// }

// // ✅ Function to start streaming
// function startStreaming() {
//     updateScore(); // Pehli baar score update karna

//     setInterval(updateScore, 15000); // Har 15 sec me update hoga

//     const ffmpeg = spawn("ffmpeg", [
//         "-stream_loop", "-1",
//         "-re",
//         "-i", VIDEO_PATH,
//         "-vf", `drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':textfile=score.txt:x=10:y=50:fontsize=15:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:reload=1`,
//         "-c:v", "libx264",
//         "-preset", "ultrafast",
//         "-b:v", "4500k",
//         "-maxrate", "5000k",
//         "-bufsize", "10000k",
//         "-g", "60",
//         "-c:a", "aac",
//         "-b:a", "128k",
//         "-ar", "44100",
//         "-ac", "2",
//         "-f", "flv", `${RTMP_URL}/${STREAM_KEY}`
//     ]);

//     ffmpeg.stdout.on("data", (data) => console.log(`STDOUT: ${data}`));
//     ffmpeg.stderr.on("data", (data) => console.error(`STDERR: ${data}`));
//     ffmpeg.on("close", (code) => console.log(`Process exited with code ${code}`));
// }

// // ✅ Express Server
// const app = express();
// const PORT = process.env.PORT || 8080;

// app.use(express.static("public"));

// app.get("/start-stream", (req, res) => {
//     startStreaming();
//     res.send("Live stream started!");
// });

// app.get("/", (req, res) => {
//     res.send("Live Stream Running!");
// });

// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });


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
const API_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;
const TARGET_MATCH_ID = "c6e97609-d9c1-46eb-805a-e282b34f3bb1";

let ffmpegProcess = null; // 🔴 FFmpeg process ko track karne ke liye

// ✅ Function to fetch and update score
async function updateScore() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (!data || !data.data || data.data.length === 0) {
            console.log("⛔ No live match found.");
            return;
        }

        const match = data.data.find(m => m.id === TARGET_MATCH_ID);

        if (!match) {
            console.log("⛔ Specified match ID ka match nahi mila.");
            return;
        }

        let scoreText = `Match: ${match.name}\n`;
        scoreText += `Venue: ${match.venue}\n`;
        scoreText += `Date: ${match.date}\n`;
        scoreText += `Status: ${match.status}\n`;

        if (match.score && match.score.length > 0) {
            match.score.forEach(inning => {
                scoreText += `${inning.inning} - ${inning.r}/${inning.w} (${inning.o} overs)\n`;
            });
        } else {
            scoreText += "Match not started yet.\n";
        }

        fs.writeFileSync(SCORE_FILE, scoreText);
        console.log("✅ Score updated:\n", scoreText);

    } catch (error) {
        console.error("❌ Error fetching score:", error.message);
    }
}

// ✅ Function to start streaming
function startStreaming() {
    updateScore(); // Pehli baar score update karna
    const scoreUpdater = setInterval(updateScore, 15000); // Har 15 sec me update hoga

    ffmpegProcess = spawn("ffmpeg", [
        "-stream_loop", "-1",
        "-re",
        "-i", VIDEO_PATH,
        "-vf", `drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':textfile=score.txt:x=10:y=50:fontsize=15:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=10:reload=1`,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-b:v", "4500k",
        "-maxrate", "5000k",
        "-bufsize", "10000k",
        "-g", "60",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-ac", "2",
        "-f", "flv", `${RTMP_URL}/${STREAM_KEY}`
    ]);

    ffmpegProcess.stdout.on("data", (data) => console.log(`STDOUT: ${data}`));
    ffmpegProcess.stderr.on("data", (data) => console.error(`STDERR: ${data}`));
    ffmpegProcess.on("close", (code) => console.log(`Process exited with code ${code}`));

    // 🔴 5 ghante baad stream band karne ka timer
    setTimeout(() => {
        console.log("🛑 5 ghante poore, stream band ho raha hai...");
        
        clearInterval(scoreUpdater); // 🔄 Score update bhi band karna
        if (ffmpegProcess) {
            ffmpegProcess.kill("SIGINT"); // FFmpeg process ko band karo
        }
        
        process.exit(0); // 🚀 Railway app bhi band ho jayega
    }, 5 * 60 * 60 * 1000); // ⏳ 5 hours = 5 * 60 min * 60 sec * 1000 ms
}

// ✅ Express Server
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
    console.log(`🚀 Server running on port ${PORT}`);
});

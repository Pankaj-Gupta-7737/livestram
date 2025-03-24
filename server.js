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


// Function to fetch and update score
async function updateScore() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (!data || !data.data || data.data.length === 0) {
            console.log("⛔ No live match found.");
            return;
        }

        // Delhi Capitals vs Lucknow Super Giants ka match hata rahe hain
        const matches = data.data.filter(m => 
            !m.teams.includes("Delhi Capitals") || !m.teams.includes("Lucknow Super Giants")
        );

        if (matches.length === 0) {
            console.log("⛔ No other match available.");
            return;
        }

        let scoreText = "🏏 IPL Live Score Updates:\n\n";
        
        matches.forEach(match => {
            scoreText += `📢 ${match.name}\n`;
            scoreText += `📍 Venue: ${match.venue}\n`;
            scoreText += `📅 Date: ${match.date}\n`;
            scoreText += `🔹 Status: ${match.status}\n`;

            if (match.score && match.score.length > 0) {
                match.score.forEach(inning => {
                    scoreText += `🏏 ${inning.inning} - ${inning.r}/${inning.w} (${inning.o} overs)\n`;
                });
            } else {
                scoreText += "⚠️ Score not available yet.\n";
            }

            scoreText += "\n-------------------------\n";
        });

        // Score file update karo
        fs.writeFileSync(SCORE_FILE, scoreText);
        console.log("✅ Score updated successfully:\n", scoreText);

    } catch (error) {
        console.error("❌ Error fetching score:", error.message);
    }
}

// Call function


// Har 30 sec me score update hoga


// Function to start streaming
const TARGET_MATCH_ID = "c6e97609-d9c1-46eb-805a-e282b34f3bb1";

// Function to fetch and update score
async function updateScore() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (!data || !data.data || data.data.length === 0) {
            console.log("⛔ No live match found.");
            return;
        }

        // 🎯 Sirf specified match ID ka data nikalo
        const match = data.data.find(m => m.id === TARGET_MATCH_ID);

        if (!match) {
            console.log("⛔ Specified match ID ka match nahi mila.");
            return;
        }

        let scoreText = `🏏 ${match.name}\n`;
        scoreText += `📍 Venue: ${match.venue}\n`;
        scoreText += `📅 Date: ${match.date}\n`;
        scoreText += `🔹 Status: ${match.status}\n`;

        if (match.score && match.score.length > 0) {
            match.score.forEach(inning => {
                scoreText += `🏏 ${inning.inning} - ${inning.r}/${inning.w} (${inning.o} overs)\n`;
            });
        } else {
            scoreText += "⚠️ Match not started yet.\n";
        }

        // 📂 Score file update karo
        fs.writeFileSync(SCORE_FILE, scoreText);
        console.log("✅ Score updated successfully:\n", scoreText);

    } catch (error) {
        console.error("❌ Error fetching score:", error.message);
    }
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
    setInterval(updateScore, 15000);
    updateScore();
    res.send("Live Stream Running!");
});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
     // Auto start on Railway
});

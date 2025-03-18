// require("dotenv").config();
// const { spawn } = require("child_process");

// // YouTube Stream Key
// const STREAM_KEY = "sy5h-4f76-t0ah-bmsf-fav9";

// // YouTube RTMP URL
// const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";

// // Local video file ka path (jo stream karni hai)
// const VIDEO_PATH = "pp.mp4";


// // FFmpeg command run karna
// const ffmpeg = spawn("ffmpeg", [
//     "-re", // Real-time mode
//     "-i", VIDEO_PATH, // Input video file
//     "-c:v", "libx264",
//     "-preset", "fast",
//     "-b:v", "2500k",
//     "-maxrate", "2500k",
//     "-bufsize", "5000k",
//     "-c:a", "aac",
//     "-b:a", "128k",
//     "-ar", "44100",
//     "-f", "flv", `${RTMP_URL}/${STREAM_KEY}`
// ]);

// // Output logs
// ffmpeg.stdout.on("data", (data) => console.log(`STDOUT: ${data}`));
// ffmpeg.stderr.on("data", (data) => console.error(`STDERR: ${data}`));
// ffmpeg.on("close", (code) => console.log(`Process exited with code ${code}`));


require("dotenv").config();
const { spawn } = require("child_process");
const path = require("path");

// YouTube Stream Key (Ye env file se lega)
const STREAM_KEY = 'sy5h-4f76-t0ah-bmsf-fav9';

// YouTube RTMP URL
const RTMP_URL = "rtmp://a.rtmp.youtube.com/live2";

// Local video file ka path
  const VIDEO_PATH = path.join(__dirname, "pp.mp4");
//  const VIDEO_PATH = "https://rr2---sn-cvhelnls.googlevideo.com/videoplayback?expire=1741727029&ei=1VDQZ4zDE7759fwPq9yqqQQ&ip=115.99.134.82&id=o-AIwNucP8fiJvEdwdAx1TApTv-zu50zaOGH1zQkHO5146&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AUWDL3yrzWkeoH5gXl0E94lLx2eQa28R_KHubKlTVNiRBVRfLZlqcsWMWx0HXyIwIso7jtU_4jW2sBY2&vprv=1&svpuc=1&mime=video%2Fmp4&ns=_Q2d9IoqlwrJIJuGJ9kV-_gQ&rqh=1&gir=yes&clen=379579179&ratebypass=yes&dur=7281.104&lmt=1739317947185959&lmw=1&fexp=24350590,24350737,24350827,24350961,24351173,24351276,24351279,24351283,24351347,24351349,24351353,24351377,51326932,51358316,51411872&c=TVHTML5&sefc=1&txp=5538534&n=puXPDkPdOFwU6Q&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIhAJIr3jnhUljV2jHXEGobbLW-bLSokIW2mxehDmpSACqmAiARe9a9MQlGtWymaC03-VknXgk9B1P5gGEGGYhQ8V4Nzw%3D%3D&title=Smart%20Lover%20%7C%20New%20Released%20South%20Indian%20Hindi%20Dubbed%20Movie%202025%20%7C%20New%202025%20Hindi%20Dubbed%20Action%20Movie&rm=sn-i5uif5t-cags7z,sn-gwpa-h55e77k,sn-h55sl7l&rrc=79,79,104&req_id=553832473d90a3ee&rms=nxu,au&redirect_counter=3&cms_redirect=yes&cmsv=e&ipbypass=yes&met=1741705439,&mh=-z&mip=2409:40c4:11eb:f88f:3928:aafc:716d:2646&mm=30&mn=sn-cvhelnls&ms=nxu&mt=1741705232&mv=m&mvi=2&pl=36&lsparams=ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=AFVRHeAwRgIhAJeHwjZTHhRZ29LKe5E8_yPigVvWszU_kM5bdMA0PIZeAiEAtH5I7_CqRpaZGwQldyrTV_-9X4TYXlfUD0Fd6Pt0Zq0%3D";

function startStreaming() {
    const ffmpeg = spawn("ffmpeg", [
        // "-stream_loop", "-1",
        // "-re", // Real-time mode
        // "-i", VIDEO_PATH, // Input video file
        // "-c:v", "libx264",
        // "-preset", "fast",
        // "-b:v", "2500k",
        // "-maxrate", "2500k",
        // "-bufsize", "5000k",
        // "-g", "60",
        // "-c:a", "aac",
        // "-b:a", "128k",
        // "-ar", "44100",
        "-stream_loop", "-1",  // Infinite loop
        "-re",  // Real-time mode
        "-i", VIDEO_PATH, // Input video file
        "-c:v", "libx264",
        "-preset", "veryfast", // Faster encoding, less CPU usage
        "-b:v", "400k", // Lower bitrate as per YouTube suggestion
        "-maxrate", "500k", // Slightly higher max bitrate
        "-bufsize", "1000k", // Buffer to reduce lag
        "-g", "50", // Keyframe interval
        "-c:a", "aac",
        "-b:a", "96k", // Lower audio bitrate
        "-ar", "44100",
        "-f", "flv", `${RTMP_URL}/${STREAM_KEY}`
    ]);

    ffmpeg.stdout.on("data", (data) => console.log(`STDOUT: ${data}`));
    ffmpeg.stderr.on("data", (data) => console.error(`STDERR: ${data}`));
    ffmpeg.on("close", (code) => console.log(`Process exited with code ${code}`));
}

// Server start
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/start-stream", (req, res) => {
    startStreaming();
    res.send("Live stream started!");
});
app.get("/", (req, res) => {
    res.send("Live Stream Running!");
});

app.listen(PORT, () => console.log(`Server running on portpp ${PORT}`));

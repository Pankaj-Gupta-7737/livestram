const fs = require('fs');

function updateScore() {
    const staticScore = "KKR 156/3 (16.4 Overs) vs RCB";
    
    // 🔹 Score ko `score.txt` me save karo
    fs.writeFileSync('score.txt', `IPL Live Score: ${staticScore}`);
    console.log("Score updated:", staticScore);
}

// 🔄 Har 30 sec me score update hoga (Manual change ke liye)
setInterval(updateScore, 30000);
updateScore();  // Pehli baar run karne ke liye

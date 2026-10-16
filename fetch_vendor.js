// Palma — pull mediapipe + tone.js locally so the exe runs offline
// Built by 1Z4K
// node fetch_vendor.js

"use strict";

const fs    = require("fs");
const path  = require("path");
const https = require("https");

const HAND_VER  = "0.4.1675469240";
const TONE_VER  = "14.8.49";
const THREE_VER = "0.160.0";

const dir = path.join(__dirname, "vendor");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const base = `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${HAND_VER}`;

const files = [
  { url: `${base}/hands.js`,                                  out: "hands.js" },
  { url: `${base}/hands_solution_packed_assets.data`,         out: "hands_solution_packed_assets.data" },
  { url: `${base}/hands_solution_packed_assets_loader.js`,    out: "hands_solution_packed_assets_loader.js" },
  { url: `${base}/hands_solution_simd_wasm_bin.js`,           out: "hands_solution_simd_wasm_bin.js" },
  { url: `${base}/hands_solution_simd_wasm_bin.wasm`,         out: "hands_solution_simd_wasm_bin.wasm" },
  { url: `${base}/hands_solution_wasm_bin.js`,                out: "hands_solution_wasm_bin.js" },
  { url: `${base}/hands_solution_wasm_bin.wasm`,              out: "hands_solution_wasm_bin.wasm" },
  { url: `${base}/hands.binarypb`,                            out: "hands.binarypb" },
  { url: `${base}/hand_landmark_full.tflite`,                 out: "hand_landmark_full.tflite" },
  { url: `${base}/hand_landmark_lite.tflite`,                 out: "hand_landmark_lite.tflite" },
  { url: `https://cdn.jsdelivr.net/npm/tone@${TONE_VER}/build/Tone.js`, out: "tone.js" },
  { url: `https://cdn.jsdelivr.net/npm/three@${THREE_VER}/build/three.min.js`, out: "three.min.js" }
];

function human(bytes){
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + " KB";
  return (bytes/1024/1024).toFixed(1) + " MB";
}

function fetch(url, dest, redirects){
  redirects = redirects || 0;
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error("too many redirects"));

    const req = https.get(url, { headers: { "User-Agent": "palma-fetch/1.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location){
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        return fetch(next, dest, redirects + 1).then(resolve, reject);
      }
      if (res.statusCode !== 200){
        res.resume();
        return reject(new Error("HTTP " + res.statusCode + " for " + url));
      }
      const file = fs.createWriteStream(dest);
      let got = 0;
      res.on("data", (chunk) => { got += chunk.length; });
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve(got)));
      file.on("error", (err) => { try { fs.unlinkSync(dest); } catch(e){} reject(err); });
    });
    req.on("error", reject);
    req.setTimeout(60000, () => { req.destroy(new Error("timeout")); });
  });
}

(async () => {
  let okCount = 0, skipCount = 0, failCount = 0;
  const failed = [];

  for (const f of files){
    const target = path.join(dir, f.out);
    if (fs.existsSync(target) && fs.statSync(target).size > 0){
      console.log("[skip] " + f.out + " (already present)");
      skipCount++;
      continue;
    }
    process.stdout.write("[get ] " + f.out + " ... ");
    try {
      const bytes = await fetch(f.url, target);
      console.log(human(bytes));
      okCount++;
    } catch (err){
      console.log("FAIL (" + err.message + ")");
      failed.push(f.out);
      failCount++;
      try { fs.unlinkSync(target); } catch(e){}
    }
  }

  console.log("");
  console.log("vendor dir: " + dir);
  console.log("  downloaded: " + okCount);
  console.log("  skipped:    " + skipCount);
  console.log("  failed:     " + failCount);

  if (failCount > 0){
    console.log("");
    console.log("failed files:");
    for (const n of failed) console.log("  - " + n);
    process.exit(1);
  }
  process.exit(0);
})();

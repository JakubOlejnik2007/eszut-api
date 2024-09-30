const fs = require("fs");
const path = require("path");
const envFilePath = path.resolve(__dirname, ".env");
const distFolderPath = path.resolve(__dirname, "dist");
fs.copyFileSync(envFilePath, path.join(distFolderPath, ".env"));
console.log('.env file has been copied to the "dist" folder.');

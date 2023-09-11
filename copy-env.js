const fs = require("fs");
const path = require("path");
const envFilePath = path.resolve(__dirname, ".env");
const distFolderPath = path.resolve(__dirname, "dist");
fs.copyFileSync(envFilePath, path.join(distFolderPath, ".env"));
console.log('.env file has been copied to the "dist" folder. We suggest to create root user by using create-root-user from utils.');

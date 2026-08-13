const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const environmentContent = `export const enviornment = {
    production: false,
    apiUrl: "${process.env.API_URL}"
}`;

fs.writeFileSync(
    path.join(__dirname, "../src/environments/environment.ts"),
    environmentContent
);

console.log("Environment variables generated successfully");
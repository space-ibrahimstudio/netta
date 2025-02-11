const axios = require("axios");

if (!process.env.CI) {
  require("dotenv").config({ path: ".env.development" });
}

const apiURL = process.env.REACT_APP_API_URL;

async function findFailedJob() {
  const formData = new FormData();
  try {
    const url = `${apiURL}/authapi/findjobfail`;
    await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    process.exit(1);
  }
}

findFailedJob();

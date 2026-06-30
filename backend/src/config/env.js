import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Validate all environment variables
Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    console.error(` Missing environment variable: ${key}`);
    process.exit(1);
  }
});

export default config;
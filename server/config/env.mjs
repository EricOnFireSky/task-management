import dotenv from "dotenv"
dotenv.config()

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager",
  nodeEnv: process.env.NODE_ENV || "development",
  apiUrl: process.env.API_URL || "http://localhost:5000",
  companyName: process.env.COMPANY_NAME || "TaskFlow",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  emailServiceId: process.env.SERVICE_ID,
  emailTemplateId: process.env.TEMPLATE_ID,
  emailPublicKey: process.env.EMAILJS_PUBLIC_KEY,
  emailPrivateKey: process.env.EMAILJS_PRIVATE_KEY,
}

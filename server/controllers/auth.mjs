import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto" // Import the crypto module
import { User } from "../models/User.mjs"
import { config } from "../config/env.mjs"
import emailjs, { EmailJSResponseStatus } from "@emailjs/nodejs"

const emailjsConfig = {
  serviceId: config.emailServiceId,
  templateId: config.emailTemplateId,
  publicKey: config.emailPublicKey,
  privateKey: config.emailPrivateKey,
}

const sendVerificationEmail = async ({ name, email, verificationToken }) => {
  const verificationUrl = `${config.apiUrl}/api/auth/verify-email?token=${verificationToken}`

  const { serviceId, templateId, publicKey, privateKey } = emailjsConfig

  const templateParams = {
    to_name: name,
    company_name: config.companyName,
    verification_url: verificationUrl,
    to_email: email,
  }

  try {
    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: publicKey,
      privateKey: privateKey,
    })
    console.log("Email Sent Successfully!")
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      console.log("EMAILJS FAILED: ", err)
      return
    }

    console.log("ERROR", err)
  }
}

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists and verified" })
      } else {
        sendVerificationEmail({
          name: existingUser.name,
          email: existingUser.email,
          verificationToken: existingUser.verificationToken,
        })

        return res.status(200).json({
          message: "User already exists. Verification email sent again.",
        })
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Create user with verification details
    const user = await User.create({
      email,
      password,
      name,
      isVerified: false,
      verificationToken,
    })

    sendVerificationEmail({
      name,
      email,
      verificationToken,
    })

    // Return success response
    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    // Find user with matching verification token and check if token hasn't expired
    const user = await User.findOne({
      verificationToken: token,
      isVerified: false,
    })

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token. Kindly register again.",
      })
    }

    // Update user verification status
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    // Generate new JWT token
    const newToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "7d" })

    // Determine if this is an API request or web browser request
    const isApiRequest = req.headers["accept"]?.includes("application/json")

    if (isApiRequest) {
      // Return JSON response for API requests
      return res.status(200).json({
        message: "Email verified successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
        },
        token: newToken,
      })
    } else {
      // Redirect to frontend success page for browser requests
      return res.redirect(`${config.frontendUrl}/verification-success?token=${newToken}`)
    }
  } catch (error) {
    console.error("Verification error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "No user found using this email" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

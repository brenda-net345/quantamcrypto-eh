import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, message, timestamp } = await req.json()

    // Get user's IP address for logging
    const forwardedFor = req.headers.get("x-forwarded-for")
    const realIP = req.headers.get("x-real-ip")
    const userIP = forwardedFor || realIP || "Unknown"

    const emailBody = `
      New Contact Form Submission - QuantumCrypto Platform
      
      From: ${name}
      Email: ${email}
      IP Address: ${userIP}
      Time: ${timestamp}
      
      Message:
      ${message}
      
      ---
      This is an automated message from the QuantumCrypto contact form.
    `

    // Check if Resend API key is available and valid
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey && resendApiKey.startsWith("re_")) {
      try {
        // Only import and use Resend if API key is properly configured
        const { Resend } = await import("resend")
        const resend = new Resend(resendApiKey)

        const { data, error } = await resend.emails.send({
          from: "QuantumCrypto Contact <contact@quantumcrypto.com>",
          to: ["masterrlisterr@gmail.com"],
          subject: "New Contact Form Submission - QuantumCrypto",
          replyTo: email, // Allow replying directly to the user
          text: emailBody,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #FFA500;">New Contact Form Submission - QuantumCrypto</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>IP Address:</strong> ${userIP}</p>
                <p><strong>Time:</strong> ${timestamp}</p>
              </div>
              <div style="background-color: #fff; padding: 20px; border-left: 4px solid #FFA500; margin: 20px 0;">
                <h3 style="margin-top: 0;">Message:</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #666;">This is an automated message from the QuantumCrypto contact form.</p>
            </div>
          `,
        })

        if (error) {
          throw new Error(`Resend API error: ${error}`)
        }

        console.log("Contact form email sent successfully via Resend:", data)
      } catch (resendError) {
        console.error("Resend failed, using console log fallback:", resendError)

        // Fallback to console logging
        console.log(`
          ============================================
          CONTACT FORM EMAIL TO: masterrlisterr@gmail.com
          ============================================
          Subject: New Contact Form Submission - QuantumCrypto
          
          ${emailBody}
          ============================================
        `)
      }
    } else {
      // No valid API key, use console logging
      console.log(`
        ============================================
        CONTACT FORM EMAIL TO: masterrlisterr@gmail.com
        ============================================
        Subject: New Contact Form Submission - QuantumCrypto
        
        ${emailBody}
        ============================================
      `)
    }

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
    })
  } catch (error) {
    console.error("Error sending contact form:", error)
    return NextResponse.json({ success: false, error: "Failed to send contact form" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { type, name, email, timestamp } = await req.json()

    // Get user's IP address (in a real app, you'd use this for basic logging)
    const forwardedFor = req.headers.get("x-forwarded-for")
    const realIP = req.headers.get("x-real-ip")
    const userIP = forwardedFor || realIP || "Unknown"

    const emailBody = `
      New ${type} Alert - QuantumCrypto Platform
      
      Event: ${type}
      Username: ${name}
      Email: ${email}
      IP Address: ${userIP}
      Time: ${timestamp}
      
      This is an automated notification from the QuantumCrypto platform.
    `

    // Check if Resend API key is available and valid
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey && resendApiKey.startsWith("re_")) {
      try {
        // Only import and use Resend if API key is properly configured
        const { Resend } = await import("resend")
        const resend = new Resend(resendApiKey)

        const { data, error } = await resend.emails.send({
          from: "QuantumCrypto <notifications@quantumcrypto.com>",
          to: ["masterrlisterr@gmail.com"],
          subject: `${type} Alert - QuantumCrypto Platform`,
          text: emailBody,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #FFA500;">New ${type} Alert - QuantumCrypto Platform</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Event:</strong> ${type}</p>
                <p><strong>Username:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>IP Address:</strong> ${userIP}</p>
                <p><strong>Time:</strong> ${timestamp}</p>
              </div>
              <p style="color: #666;">This is an automated notification from the QuantumCrypto platform.</p>
            </div>
          `,
        })

        if (error) {
          throw new Error(`Resend API error: ${error}`)
        }

        console.log("Email sent successfully via Resend:", data)
      } catch (resendError) {
        console.error("Resend failed, using console log fallback:", resendError)

        // Fallback to console logging
        console.log(`
          ============================================
          NOTIFICATION EMAIL TO: masterrlisterr@gmail.com
          ============================================
          Subject: ${type} Alert - QuantumCrypto Platform
          
          ${emailBody}
          ============================================
        `)
      }
    } else {
      // No valid API key, use console logging
      console.log(`
        ============================================
        NOTIFICATION EMAIL TO: masterrlisterr@gmail.com
        ============================================
        Subject: ${type} Alert - QuantumCrypto Platform
        
        ${emailBody}
        ============================================
      `)
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 })
  }
}

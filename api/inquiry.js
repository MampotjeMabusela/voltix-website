const INQUIRY_EMAIL = "voltrixelectrical@protonmail.com";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ success: false, message: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return response.status(503).json({
      success: false,
      message: "Email service is not configured yet.",
    });
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const { name, email, phone, propertyType, message, interests, subscribe } = body || {};

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return response.status(400).json({ success: false, message: "Missing required fields." });
    }

    const interestList = Array.isArray(interests) ? interests.join(", ") : interests || "Not specified";
    const html = `
      <h2>New Voltix Website Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Property type:</strong> ${escapeHtml(propertyType || "Not specified")}</p>
      <p><strong>Primary interests:</strong> ${escapeHtml(interestList)}</p>
      <p><strong>Marketing updates:</strong> ${subscribe ? "Yes" : "No"}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message || "No message provided.")}</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Voltix Website <onboarding@resend.dev>",
        to: [INQUIRY_EMAIL],
        reply_to: email,
        subject: `New Voltix Inquiry from ${name}`,
        html,
      }),
    });

    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error("Resend error:", result);
      return response.status(502).json({
        success: false,
        message: result.message || "Failed to send email.",
      });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return response.status(500).json({ success: false, message: "Server error while sending inquiry." });
  }
}

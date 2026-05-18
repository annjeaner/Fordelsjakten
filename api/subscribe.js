export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Ugyldig e-postadresse" });
  }

  try {
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/6e3bcd44-52d1-11f1-84ff-d79f5c305637/contacts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.REACT_APP_MAILOCTOPUS_KEY,
          email_address: email,
          status: "PENDING",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Serverfeil" });
  }
}

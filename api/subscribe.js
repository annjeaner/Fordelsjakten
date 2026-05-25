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
      `https://emailoctopus.com/api/1.6/lists/3d261c04-5142-11f1-880c-83dd77763a02/contacts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.MAILOCTOPUS_KEY,
          email_address: email,
          status: "PENDING",
          tags: ["Kalkulator"],
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

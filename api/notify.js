// api/notify.js
const fetch = require('node-fetch');

export default async function handler(req, res) {
  // Security: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userIds, title, message, url } = req.body;
  const ONESIGNAL_APP_ID = "50205842-082e-42e7-9b7f-958653483863";
  // We get the REST API Key from Vercel Environment Variables
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_REST_KEY;

  if (!userIds || !message) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${ONESIGNAL_API_KEY}`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_player_ids: userIds, // The OneSignal ID of the user receiving the msg
        headings: { en: title || "New Message" },
        contents: { en: message },
        url: url || "", // Open the chat when clicked
        android_group: "prerana_chat", // Group notifications
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}

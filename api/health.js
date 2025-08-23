module.exports = function handler(req, res) {
  res.status(200).json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    bot_token: process.env.BOT_TOKEN ? "configured" : "missing",
    webapp_url: process.env.WEBAPP_URL || "missing",
    webhook_secret: process.env.TG_WEBHOOK_SECRET ? "configured" : "missing"
  });
};

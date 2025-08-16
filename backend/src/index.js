const express = require('express');
const app = express();
const PORT = 5000;

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

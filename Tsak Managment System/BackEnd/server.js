const app = require('./app.js');
const PORT = 3000;  // ← حتماً 3000 یا 4000 بذار، 5173 برای Vite هست
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} `);
});
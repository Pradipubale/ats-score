const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));

const ai = require('./utils/ai');

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server on port ${PORT}`);
  const aiStatus = await ai.verifyApiKey();
  if (aiStatus.ok) {
    console.log('✅ ' + aiStatus.message);
  } else {
    console.error('❌ ' + aiStatus.message);
  }
});

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bitcoin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const RecordSchema = new mongoose.Schema({
  // Define your schema here based on your data
  page_number: Number,
  row_data: [String],
  address: String,
  balance: Number,
  percentage_of_coins: Number,
  first_in: Date,
  last_in: Date,
  ins: Number,
  first_out: Date,
  last_out: Date,
  outs: Number,
});

const Record = mongoose.model('Record', RecordSchema);

// Middleware
app.use(express.json());

// Route to get data with pagination
app.get('/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  try {
    const totalRecords = await Record.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);
    const records = await Record.find().skip(skip).limit(limit);

    res.json({
      items: records,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

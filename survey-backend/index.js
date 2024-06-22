const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const questions = {
  Technology: [
    "What is your favorite JavaScript framework?",
    "How do you manage state in React?"
  ],
  Health: [
    "What is your daily water intake?",
    "Do you follow any specific diet plan?"
  ],
  Education: [
    "What are your thoughts on online learning?",
    "How do you stay motivated during your studies?"
  ]
};

app.get('/api/questions', (req, res) => {
  const topic = req.query.topic;
  res.json({ questions: questions[topic] || [] });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

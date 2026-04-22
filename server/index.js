require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const coursesRoutes = require('./routes/courses');
const eventsRoutes = require('./routes/events');
const quizzesRoutes = require('./routes/quizzes');
const recordingsRoutes = require('./routes/recordings');
const quizResultsRoutes = require('./routes/quizResults');
const discussionsRoutes = require('./routes/discussions');
const studySessionsRoutes = require('./routes/studySessions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/courses', coursesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/recordings', recordingsRoutes);
app.use('/api/quiz-results', quizResultsRoutes);
app.use('/api/discussions', discussionsRoutes);
app.use('/api/study-sessions', studySessionsRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

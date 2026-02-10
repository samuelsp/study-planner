import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import studySessionRoutes from './routes/studySession.routes';
import resourceRoutes from './routes/resource.routes';
import { checkAndSendReminders } from './services/notification.service';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use('/sessions', studySessionRoutes);
app.use('/resources', resourceRoutes);

app.get('/', (req, res) => {
    res.send('Study Planner API is running');
});

// Cron Job - Check Reminders every minute
cron.schedule('* * * * *', () => {
    checkAndSendReminders();
});

// Start Server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log('Server closed');
    });
});

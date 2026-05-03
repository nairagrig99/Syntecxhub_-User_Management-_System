import express from 'express';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.log('❌ Database connection error:', err));


app.get('/', (req, res) => {
    res.send('API is running and connected!');
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});

app.use('/', userRoutes);
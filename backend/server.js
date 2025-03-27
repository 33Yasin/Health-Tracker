import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();  // load variables from the .env file

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());  // CORS middleware

app.get('/', (req, res ) => {
    res.send("Health Tracker API is running! 🚀 ")   // test message
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


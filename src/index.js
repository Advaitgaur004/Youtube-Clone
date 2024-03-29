import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';  // import app


dotenv.config({
    path : '/.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Server is running on port', process.env.PORT || 8000);
    });
    console.log('MongoDB connected');
})
.catch((error) => {
    console.error('MongoDB connection failed', error);
})

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authToken from './middleware/authToken.js';
import isAdmin  from './middleware/isAdmin.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import adminRoutes from './routes/admin.js';
import dotenv from 'dotenv';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

dotenv.config();


const swaggerDocument = YAML.load('./swagger.yaml'); 
swaggerDocument.servers[0].url = `http://localhost:${process.env.PORT || 3000}`;


const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
};
            

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})


const MONGO_DB_URL= process.env.MONGO_DB_URL

mongoose.connect(MONGO_DB_URL)
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((error)=>{
        console.log('Error:', error);
    })

app.use('/auth', authRoutes);
app.use('/task',  authToken, isAdmin, taskRoutes);
app.use('/admin', authToken, isAdmin,  adminRoutes);


import express from 'express';
import dotenv from 'dotenv';
import init_db from './config/init_db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from './routes/route.js';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
init_db();

for (const route in routes) {
  app.use(route, routes[route]);
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT} `);
});

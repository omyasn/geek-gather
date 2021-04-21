import * as express from 'express';
import main from './routes/main';

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.get('/', main);
// app.get('/search', severRenderMiddleware);

export default app;
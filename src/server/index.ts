import * as express from 'express';
import main from './routes/main';
import search from './routes/search';

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.get('/', main);
app.get('/search', search);

export default app;
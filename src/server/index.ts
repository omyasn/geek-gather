import * as express from 'express';
import main from './routes/main';
import search from './routes/search';
import event from './routes/event';

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.get('/', main);
app.get('/search', search);
app.get('/event/:id', event);

export default app;
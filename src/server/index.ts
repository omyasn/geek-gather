import * as express from 'express';
import main from './routes/main';
import search from './routes/search';
import event from './routes/event';
import about from './routes/about';

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.get('/', main);
app.get('/search', search);
app.get('/event/:id', event);
app.get('/about', about);

export default app;
import express from 'express';
import severRenderMiddleware from './severRenderMiddleware';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('./public'));

app.get('/', severRenderMiddleware);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const morgan = require('koa-morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = new Koa();
const router = new Router();

app.use(morgan('combined'));

app.use(bodyParser());

router.get('/', async (ctx) => {
  ctx.body = 'Welcome to the home page!';
});

router.get('/data', async (ctx) => {
  ctx.body = 'This is the data page.';
});

router.post('/data', async (ctx) => {
  const data = ctx.request.body;
  ctx.status = 201;
  ctx.body = `Data received: ${JSON.stringify(data)}`;
});

router.put('/data', async (ctx) => {
  const data = ctx.request.body;
  ctx.body = `Data updated: ${JSON.stringify(data)}`;
});

router.delete('/data', async (ctx) => {
  ctx.body = 'Data deleted.';
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err.stack);
    ctx.status = err.status || 500;
    ctx.body = 'Something went wrong!';
  }
});

app.use(async (ctx, next) => {
  ctx.status = 404;
  ctx.body = 'Not Found';
  await next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

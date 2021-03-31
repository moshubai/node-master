const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
   const start = Date.now()
   await next()

   const end = Date.now()

   console.log('耗时：',end-start); //xu-log
});


app.use((ctx, next) => {
    ctx.body = {
        name: 'Hello Koa'
    }
});

app.listen(3000); 
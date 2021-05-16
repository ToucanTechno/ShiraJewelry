const express = require('express')
const productsRouter = require('./routers/products-router');
const DBSession = require('./model/db-session');

const app = express()
const PORT = 3000

/*mysqlx.getSession({ user: config.user, password: config.password, port: config.port })
  .then(session => {
    const table = session.getSchema(config.schema).getTable('products');

    return table.insert('name', 'description_en', 'price')
      .values('foo', 'barfoobar', 42)
      .execute()
      .then(() => {
        return table.select()
          .execute()
      })
      .then(res => {
        console.log(res.fetchOne()); // ['foo', 42]
      })
      .then(() => {
        return session.close();
      })
  });*/

DBSession.build().then((dbSession) => {
  // TODO: Add authentication middleware that validates cookies, except for the login/signup requests

  // TODO: Remove handling /
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use(express.urlencoded({ extended: false }));

  app.use('/products', (req, res, next) => {
    req.locals = { dbSession: dbSession };
    productsRouter(req, res, next);
  });

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
});

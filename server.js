const express = require('express');
const app = express();
const PORT = 3001;
const db = require('./db');
const { Company, Product, Offering, syncAndSeed } = db;
const chalk = require('chalk');
const path = require('path');

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/companies', (req, res, next) => {
  Company.findAll({
      include: [Offering
      ]
  })
    .then(companies => res.send(companies))
    .catch(next);
});

app.get('/api/products', (req, res, next) => {
  Product.findAll()
    .then(products => res.send(products))
    .catch(next);
});
app.get('/api/offerings', (req, res, next) => {
    Offering.findAll()
      .then(offering => res.send(offering))
      .catch(next);
  });
syncAndSeed().then(() => {
  app.listen(PORT, () => {
    console.log(chalk.green(`Listening on ${PORT}`));
  });
}); 

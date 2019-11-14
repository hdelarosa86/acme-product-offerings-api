const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost:5432/our_db');

const uuidDefinition = {
  type: Sequelize.UUID,
  primaryKey: true,
  defaultValue: Sequelize.UUIDV4,
};

const Product = conn.define('product', {
  id: uuidDefinition,
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  suggestedPrice: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
});

const Company = conn.define('company', {
  id: uuidDefinition,
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
});
const Offering = conn.define('offering', {
  price: {
    type: Sequelize.DECIMAL,
  },
});

Offering.belongsTo(Company);
Company.hasMany(Offering);

Offering.belongsTo(Product);
Product.hasMany(Offering);

const syncAndSeed = async () => {
  try {
    await conn.sync({ force: true });
    const companies = [
      { name: 'acme' },
      { name: 'amazon' },
      { name: 'google' },
      { name: 'apple' },
    ];

    const [acme, amazon, google, apple] = await Promise.all(
      companies.map(company => Company.create(company))
    );

    const products = [
      { name: 'foo', suggestedPrice: 4.5 },
      { name: 'bar', suggestedPrice: 2.5 },
      { name: 'iphone', suggestedPrice: 100 },
      { name: 'widget', suggestedPrice: 10.5 },
      { name: 'earpods', suggestedPrice: 30.5 },
    ];

    const [foo, bar, iphone, widget, earpods] = await Promise.all(
      products.map(product => Product.create(product))
    );

    const offerings = [
      { price: 4, companyId: acme.id, productId: foo.id },
      { price: 2, companyId: acme.id, productId: bar.id },
      { price: 11, companyId: amazon.id, productId: widget.id },
      { price: 150, companyId: amazon.id, productId: iphone.id },
      { price: 50, companyId: amazon.id, productId: earpods.id },
      { price: 7, companyId: amazon.id, productId: foo.id },
      { price: 3, companyId: google.id, productId: bar.id },
      { price: 100, companyId: apple.id, productId: iphone.id },
      { price: 30, companyId: apple.id, productId: earpods.id },
      { price: 20, companyId: apple.id, productId: widget.id },
      { price: 10, companyId: acme.id, productId: widget.id },
    ];
    await Promise.all(offerings.map(offer => Offering.create(offer)));
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  syncAndSeed,
  conn,
  Company,
  Product,
  Offering,
};

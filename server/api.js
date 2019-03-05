const apiRouter = require('express').Router();

const db = require('./db');
const { validateHouse, houseAsSqlParams } = require('./validation');

const HOUSES_PER_PAGE = 4;

let lastId = 3;

const fakeDB = [
  {
    id: 1,
    price: 10000
  },
  {
    id: 2,
    price: 15000
  },
  {
    id: 3,
    price: 20000
  }
];

const addHousesSql = `
  replace into houses(
    link,
    location_country,
    location_city,
    size_rooms,
    price_value,
    price_currency
  ) values ?;
`;

apiRouter
  .route('/houses')
  .get(async (req, res) => {
    let {
      price_min = 0,
      price_max = 1000000,
      order = 'location_country_asc',
      page = 1,
      location_city = ''
    } = req.query;

    price_min = parseInt(price_min, 10);
    if (Number.isNaN(price_min) || price_min < 0) {
      return res.status(400).json({
        error: `'price_min' should be positive number`
      });
    }

    price_max = parseInt(price_max, 10);
    if (Number.isNaN(price_max) || price_max < 0) {
      return res.status(400).json({
        error: `'price_max' should be positive number`
      });
    }

    if (price_max < price_min) {
      return res.status(400).json({
        error: `'price_max' should be bigger than 'price_min'`
      });
    }

    page = parseInt(page, 10);
    if (Number.isNaN(page) || page <= 0) {
      return res.status(400).json({
        error: `'page' should be number more than 0`
      });
    }

    let order_field, order_direction;
    const index = order.lastIndexOf('_');
    if (index > 0) {
      order_field = order.slice(0, index);
      order_direction = order.slice(index + 1);

      if (['asc', 'desc'].indexOf(order_direction) === -1) {
        return res.status(400).json({
          error: `'order' param is wrong`
        });
      }
    } else {
      return res.status(400).json({
        error: `'order' param is wrong`
      });
    }

    const offset = (page - 1) * HOUSES_PER_PAGE;

    const conditions = [`(price_value between ? and ?)`];
    const params = [price_min, price_max];

    if (location_city.length) {
      conditions.push(`location_city = "?"`);
      params.push(location_city);
    }

    const queryBody = `
      from houses
      where ${conditions.join(' and ')}
    `;

    const queryTotal = `
      select count(id) as total
      ${queryBody}
    `;

    const queryItems = `
        select *
        ${queryBody}
        order by ${db.escapeId(order_field, true)} ${order_direction}
        limit ${HOUSES_PER_PAGE}
        offset ${offset}
      `;

    try {
      const total = await db.queryPromise(queryTotal, params);
      const houses = await db.queryPromise(queryItems, params);

      res.json({
        total: total[0].total,
        houses,
        pageSize: HOUSES_PER_PAGE
      });
    } catch (err) {
      console.log(err.sql);
      console.log(Object.keys(err));
      res.status(400).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'data should be an array' });
    }

    const processedData = req.body.map((houseObj) => {
      return validateHouse(houseObj);
    });

    const validData = [];
    const invalidData = [];

    processedData.forEach((el) => {
      if (el.valid) {
        validData.push(el);
      } else {
        invalidData.push(el);
      }
    });

    const report = {
      valid: validData.length,
      invalid: invalidData
    };

    if (validData.length) {
      try {
        const housesData = validData.map((el) => houseAsSqlParams(el.raw));

        await db.queryPromise(addHousesSql, [housesData]);

        return res.json(report);
      } catch (err) {
        return res.status(500).json({
          error: err.message
        });
      }
    } else {
      res.json(report);
    }
  });

apiRouter
  .route('/houses/:id')
  .get((req, res) => {
    const { id } = req.params;

    const item = fakeDB.find((house) => {
      return house.id === parseInt(id, 10);
    });

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'no item with this id' });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;

    const index = fakeDB.findIndex((house) => {
      return house.id === parseInt(id, 10);
    });

    if (index > -1) {
      fakeDB.splice(index, 1);

      res.send(`house ${id} was deleted`);
    } else {
      res.send('there was no house with this id');
    }
  });

apiRouter.use((req, res) => {
  res.status(404).end();
});

module.exports = apiRouter;

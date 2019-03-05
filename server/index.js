const axios = require('axios');

const app = require('./app');

const PORT = 4321;

// const { validateHouse } = require('./validation');

// function fun() {
//   axios.get('http://pastebin.com/raw/7YurpmPM').then((res) => {
//     console.log(res.data.map(validateHouse));
//   });
// }

// setInterval(fun, 60 * 1000);
// fun();

app.listen(PORT, () => {
  console.log(`app is running at http://localhost:${PORT}`);
});

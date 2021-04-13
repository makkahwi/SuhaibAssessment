const Papa = require("PapaParse");
const fs = require("fs");
const axios = require("axios");

let file = fs.createReadStream('./data/sg.csv');

let params = {
  token: "BTC",
  date: "2021/12/1"
}

// const epochToDateConverter = (date) => {
//   axios.get(`https://showcase.api.linx.twenty57.net/UnixTime/tounix`, {
//     params: {
//       date: date,
//     }
//   })
//   .then( result => {
//     return result;
//   })
//   .catch( err => {
//     return err;
//   })
// }

const timestampToDateTimeConverter = (timestamp) => {
  axios.get(`https://showcase.api.linx.twenty57.net/UnixTime/fromunix`, {
    params: {
      timestamp: timestamp,
    }
  })
  .then( result => {
    console.log(result)
    return result
  })
  .catch( err => {
    console.log(err);
  })
}


let balances = {};
let tokens = [];

Papa.parse(file, {
  header: true,
  step: result => {
    if ((params.token && params.date && params.token === result.data.token && params.date === timestampToDateTimeConverter(parseint(result.data.timestamp))) || (params.token && !params.date && params.token === result.data.token) || (params.date && !params.token && params.date === timestampToDateTimeConverter(parseint(result.data.timestamp))) || (!params.token && !params.date))
    {
      if (!tokens.includes(result.data.token))
      {
        tokens.push(result.data.token);
        balances[result.data.token] = 0;
      }

      if (result.data.transaction_type === "DEPOSIT")
      {
        balances[result.data.token] += parseFloat(result.data.amount);
      }
      else
      {
        balances[result.data.token] -= parseFloat(result.data.amount);
      }
    }
  },
  complete: () => {
    getUSDBalances()
  }
})

const getUSDBalances = () => {
  tokens.forEach(token => {
    axios.get(`https://min-api.cryptocompare.com/data/price`, {
      params: {
        fsym: token,
        tsyms: "USD"
      }
    })
    .then( result => {
      fs.appendFile("./results.txt", JSON.stringify({[token]: "USD"+result.data.USD * balances[token]}), 'utf8', function(err, result) {
        if (err) console.log('error', err);
      })
    })
  });
}
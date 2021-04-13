const Papa = require("PapaParse");
const fs = require("fs");
const axios = require("axios");

let file = fs.createReadStream('./data/sample.csv');

let params = {
  token: "BTC",
  date: "2021-12-1"
}

let x = 0;

let data = [];

Papa.parse(file, {
  header: true,
  step: result => {
    storeData(result)
  },
  complete: () => {
    getBalances(data)
  }
})

const storeData = (result) => {
  if ( (params.token && params.date && params.token === result.data.token && params.date === result.data.timestamp))
  {
    data[x++] = result.data;
  }
}

const getBalances = (data) => {
  let balances = {};
  let tokens = [];
  let rates = {};

  data.forEach(record => {
    if (!tokens.includes(record.token))
    {
      tokens.push(record.token);
      balances[record.token] = 0;
    }

    if (record.transaction_type === "DEPOSIT")
    {
      balances[record.token] += parseFloat(record.amount);
    }
    else
    {
      balances[record.token] -= parseFloat(record.amount);
    }
  });

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
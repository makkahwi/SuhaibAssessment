const Papa = require("PapaParse");
const fs = require("fs");
const axios = require("axios");

let file = fs.createReadStream('./data/transactions.csv');

let params = {  // Here are the parameters where to get to spacify the token or date by uncommenting the line and changing value
  // token: "BTC",
  // date: "12-31-2017"
};

let balances = {};
let tokens = [];

const parseFile = (date) => {
  Papa.parse(file, {
    header: true,
    step: result => {
      if ((params.token && params.date && params.token === result.data.token && date > parseInt(result.data.timestamp)) || (params.token && !params.date && params.token === result.data.token) || (params.date && !params.token && date > parseInt(result.data.timestamp)) || (!params.token && !params.date))
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
}

if (params.date)
{
  const date = new Date(params.date);
  
  const DatetimeToUnixConverter = () => {
    axios.get(`https://showcase.api.linx.twenty57.net/UnixTime/tounix`, {
      params: {
        date: date,
      }
    })
    .then( result => {
      parseFile(parseInt(result.data)+115200);
    })
    .catch( err => {
      return err;
    })
  }

  DatetimeToUnixConverter(date);
}
else
{
  parseFile();
}

const getUSDBalances = () => {
  tokens.forEach(token => {
    axios.get(`https://min-api.cryptocompare.com/data/price`, {
      params: {
        fsym: token,
        tsyms: "USD"
      }
    })
    .then( result => {
      fs.appendFile("./results/results.txt", JSON.stringify({[token]: "USD"+result.data.USD * balances[token]}), 'utf8', function(err, result) {
        if (err) console.log('error', err);
      })
    })
  });
}
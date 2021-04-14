const Papa = require("PapaParse");
const fs = require("fs");
const axios = require("axios");

let file = fs.createReadStream('./data/transactions.csv');

let params = {  // Here are the parameters where to get to spacify the token or date by uncommenting the line and changing value
  // token: "BTC",
  // date: "12-31-2017"
};

let formattedDate;
let balances = {};
let tokens = [];

if (params.date)
{
  formattedDate = new Date(params.date);
  formattedDate.setDate(formattedDate.getDate() + 2);

  const unixToDateTimeConverter = () => {
    axios.get(`https://showcase.api.linx.twenty57.net/UnixTime/tounix`, {
      params: {
        date: formattedDate,
      }
    })
    .then( res => {
      Papa.parse(file, {
        step: result => {
          getTokenBalances(result, res)
        },
        complete: () => {
          getUSDBalances();
        }
      })
    })
    .catch( err => {
      return err;
    })
  };

  unixToDateTimeConverter();
}
else
{
  Papa.parse(file, {
    step: result => {
      getTokenBalances(result, res)
    },
    complete: () => {
      getUSDBalances();
    }
  })
}

const getTokenBalances = (result, res) => {
  if ((params.token && params.date && params.token === result.data.token && (parseInt(res.data) > parseInt(result.data[0]))) || (params.token && !params.date && params.token === result.data.token) || (params.date && !params.token && (parseInt(res.data) > parseInt(result.data[0]))) || (!params.token && !params.date))
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
      fs.appendFile("./results/noParameters.txt", JSON.stringify({[token]: "USD"+result.data.USD * balances[token]}), 'utf8', function(err, result) {
        if (err) console.log('error', err);
      })
    })
  });
}
# SuhaibAssessment
Home-Assignment for Suhaib's Job Application

## You could find question 1 answer in a txt file called "quetsionone.txt"

## N every other file is about question 2

Now to run the code you have to clone the repo, run "yarn" or "npm i" command to install libraries. Then, it's all about running the cryptoBalances file where the code is located, using "node cryptoBalances.js" command.

To use the parameter (token, date or token & date), you could find a variable call params and instructions to use it.

## Code Strcuture 

In this case I took the simplest and shortest (and I believe the fastest to process n get the job done) path to build the code.
Which is about parsing the csv file, in while parsing it's being filtered to meet the given parameters..
Once the parsed record pass the parameter condition it would start being processed as follows
- It will be checked if its token as a new one for the software, n if so it will be stored in an array of the unique tokens in order to use that array n get exchange rates.
- Then Inside an array called balances, the record amount will be added / subtracted from the existing balance based on transaction type (deposit or withdraw).
- Once all records been processed and final token balances are determined, the system will call the exchange rates for tokens and use them to get to USD balance for each token n save that to a txt file.

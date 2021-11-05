var mongoose = require("mongoose");
var db = require("../models");

mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const transactionSeed = [
    {
        name: "Paycheck",
        value: 1000,
        date: newDate(Date.now())
    },
    {
        name: "City",
        value: 130,
        date: newDate(Date.now())
    },
    {
        name: "Groceries",
        value: 100,
        date: newDate(Date.now())
    },
    {
        name: "Gas",
        value: 25,
        date: newDate(Date.now())
    },
]
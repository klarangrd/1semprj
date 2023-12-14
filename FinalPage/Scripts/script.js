const express = require("express");
const app = express();
const port = 10000;
const { Client } = require("pg");
const pg = require("pg");
const cors = require("cors");
const klient = new Client({
  user: "bbjectmt",
  host: "balarama.db.elephantsql.com",
  database: "bbjectmt",
  //læg mærke til at user og database er det samme på
  //elephant, da vi er på en shared instance
  password: "fsno_IlKUQc6zzSJETu4ImAqI_lQKqaX",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.use(cors({ origin: "*" }));
const qry1 = "SELECT * FROM populationdata";
klient.connect();
app.get("/population", async (req, res) => {
  try {
    let queryData = await klient.query(qry1);
    res.json({
      ok: true,
      LionfishCloud: queryData.rows,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error.message,
    });
  }
});
const qry2 = "SELECT * FROM kordinater";
app.get("/kordinater", async (req, res) => {
  try {
    let queryData = await klient.query(qry2);
    res.json({
      ok: true,
      LionfishCloud: queryData.rows,
    });
  } catch (error) {
    res.json({
      ok: false,
      message: error.message,
    });
  }
});
app.listen(port, () => {
  console.log(`Appl. lytter på http://0.0.0.0:${port}`);
});
/*
En anden måde at gøre det på ved at bruge en connection string. Det fylder lidt
mindre,
men gør at man skal forstå de forskellige delelementer i selve connection
string'en.
Bliver typisk brugt af erfarne udviklere, da det netop fylder mindre. De første fem
linjer
skal stadig være med, mens resten af koden udskiftes med følgende:
const connString = 'postgres://rhdpbdhc:Tw1Ig4dRU_shwpzDrKXjEE7S-
WRJImzx@cornelius.db.elephantsql.com/rhdpbdhc';
var client = new pg.Client(connString);
client.connect(function(err) {
if(err) {
return console.error('could not connect to postgres', err);
}
client.query('SELECT food_item from food', function(err, result) {
if(err) {
return console.error('error running query', err);
}
console.log(result.rows[0]);
client.end();
});
});*/

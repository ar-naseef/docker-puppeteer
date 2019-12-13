const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const Scrapers = require('./scrapers');

const PORT = 3333;
const app = express();

app.use(cors());

app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log("test")
  res.json({
    test: "test success"
  })
})

app.post('/verify-vet', async (req, res) => {
  console.log("verifying vet")
  console.log(req.body);

  if (Scrapers[req.body.state]) {
    const verifiedData = await Scrapers[req.body.state].vet({
      state: req.body.state,
      board: req.body.board,
      licence_type: req.body.licence_type,
      licence_number: req.body.licence_number
    });

    console.log("sending response \n")
    if (verifiedData.error) {
      res.status(500).json({
        status: verifiedData.status,
        error: verifiedData.error,
        data: verifiedData.data,
        query: req.body
      })
    } else {
      res.json({
        status: verifiedData.status,
        data: verifiedData.data,
        query: req.body
      })
    }

  } else {
    console.log("invlid state")
    console.log("sending response \n")
    res.status(500).json({
      "msg": "done",
      "error": "invalid state"
    })
  }
})

app.post('/verify-therapy', async (req, res) => {
  console.log("verifying therapy")
  console.log(req.body);

  if (Scrapers[req.body.state]) {
    const verifiedData = await Scrapers[req.body.state].therpay({
      state: req.body.state,
      board: req.body.board,
      licence_type: req.body.licence_type,
      licence_number: req.body.licence_number
    });

    console.log("sending response \n")
    if (verifiedData.error) {
      res.status(500).json({
        status: verifiedData.status,
        error: verifiedData.error,
        data: verifiedData.data,
        query: req.body
      })
    } else {
      res.json({
        status: verifiedData.status,
        data: verifiedData.data,
        query: req.body
      })
    }

  } else {
    console.log("invlid state")
    console.log("sending response \n")
    res.status(500).json({
      "msg": "done",
      "error": "invalid state"
    })
  }
})

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    throw (err)
  } else {
    console.log("server running in " + PORT)
  }
});
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(logger('dev'))

app.use(cors())

app.use((err, req, res, next) => {
  logger.error(err)

  if(req.app.get('env') !== 'development') {
    delete err.stack
  }

  return res.status(err.statusCode || 500).json(err)
})

app.get('/', (req, res) => {
  res.send('Hello there')
})

app.listen(process.env.PORT)

console.log(`Server started on ${process.env.PORT}`)

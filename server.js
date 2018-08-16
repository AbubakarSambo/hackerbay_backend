const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cors({origin: ['http://localhost:3000','http://localhost:8000','https://footy-client.herokuapp.com']}));
app.use(bodyParser.json())

const port = process.env.PORT || 8080

require('./app/routes/index.js')(app)

app.listen(port)

module.exports = app

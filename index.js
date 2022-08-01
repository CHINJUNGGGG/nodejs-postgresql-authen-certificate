const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3500

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/getCode', db.getCode)
app.get('/getCodeById/:partner_code_id', db.getCodeById)
app.post('/createCode', db.createCode)
app.put('/updateCode/:email', db.updateCode)
app.delete('/deleteCode/:email', db.deleteCode)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
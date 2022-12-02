const express = require('express')
const app = express()
const query = require('./routes/queries')
require('dotenv').config()
const error404 = require('./middleware/error404')
const customErrorHandler = require('./middleware/customErrorHandler')
const cors = require('cors')

//allow cross origin requests
app.use(cors())
//json objects
app.use(express.json())
//static pages
app.use(express.static('./public'))
//routes
app.use('/api/v1/records', query)
//unknown route
app.use(error404)
//customerError Handler
app.use(customErrorHandler)

const port = process.env.PORT || 5000
//server function
const spinServer = async()=>{
   try {
      app.listen(port, ()=>{
         console.log(`Listening on port ${port}...`)
      })
   } catch (error) {
      console.log(error);
   }
}
//start server
spinServer()

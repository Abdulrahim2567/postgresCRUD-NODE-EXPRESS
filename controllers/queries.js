const pool = require('../database/connect')
const asyncWrapper = require('../middleware/asyncWrapper')
const {StatusCodes} = require('http-status-codes')
const {createCustomError} = require('../custom-error/errors')

const getAllRecords = asyncWrapper (async (req, res)=>{
   const query = `SELECT * FROM travel_ticket ORDER BY passenger_name ASC`
   await pool.query(query, (error, results) =>{
      if(error){
         res.status(StatusCodes.NOT_FOUND).json({success: false, errmsg:error.message})
      }
      else{
         results.rows.forEach(row =>{
            const dateDB = new Date(row.issuing_date)
            row.issuing_date = dateDB.toLocaleDateString()
              const difference_in_time = dateDB.getTime() - new Date().getTime()
            const fullday = Math.ceil(difference_in_time / (1000*3600*24))
            const hours = ((difference_in_time / (1000*3600*24)) - fullday) * 24
            if(fullday == 0)
               row.days = Math.ceil(hours).toString().concat(" hrs")
            if(dateDB.getTime() > new Date().getTime())
               {
                  row.days =  (fullday * -1) + " Days"
                  row.flight_status = `Pending`
               }
            else if(dateDB.getTime() < new Date().getTime())
               {
                  row.days = "+" + (fullday* (-1)) + " Days"
                  row.flight_status = `Flown`
               }
            else
            {
               row.flight_status = `Boarding`
               row.days = "Today"
            }
            if(dateDB.toDateString() == new Date().toDateString())
               row.flight_status = `Boarding`
            row.issuing_date = new Date(row.issuing_date).toDateString()
         })  
         res.status(StatusCodes.OK).json({success: true, record:results.rows})
      }
   }) 
})

const createNewRecord = asyncWrapper (async (req, res)=>{
   const query = `INSERT INTO travel_ticket 
   (ticket_number, passenger_name, airline, number, currency, amount, itinerary, issuing_date, travel_type)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
   console.log(req.body);
   const {passenger_name, airline, currency, amount, itinerary, issuing_date, travel_type} = req.body
   const number = req.body.number || getserialNumber()
   await pool.query(query, [(airline + number), passenger_name, airline, number, currency, Number(amount), itinerary, issuing_date, travel_type],
   (error, results) =>{
      if(error){
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, errmsg:error.message})
      }
      else{
         res.status(StatusCodes.CREATED).json({success: true, msg: `Ticket created with ID: ${results.rows[0].ticket_number}`})
      }
   })
})
const createMultipleRecords = asyncWrapper(async (req, res)=>{
   let inserted_records = []
   let not_inserted = []
   const query = `INSERT INTO travel_ticket 
   (ticket_number, passenger_name, airline, number, currency, amount, itinerary, issuing_date)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
   console.log(req.body)
   for (const key in req.body)
   {
      const {passenger_name, airline, currency, amount, itinerary, issuing_date,  travel_type} = req.body[key]
      const number = req.body[key].ticket_number || getserialNumber()
      pool.query(query, [(airline + number), passenger_name, airline, number, currency, Number(amount), itinerary, issuing_date,  travel_type],
      (error, results) =>{
         if(error){
            not_inserted.push(JSON.parse(`Ticket ID: ${results.rows[0].ticket_number} was not created`))
         }
         else{
            inserted_records.push(JSON.parse(`Ticket created created with ID: ${results.rows[0].ticket_number}`))
         }
      })
   }
   res.status(StatusCodes.CREATED).json({inserted: inserted_records, non_inserted: not_inserted})
})

const getSingleRecord = asyncWrapper (async (req, res, next)=>{
   const {id:ticket_number} = req.params
   const query = `SELECT * FROM travel_ticket WHERE ticket_number = $1`
   await pool.query(query, [ticket_number],
   (error, results) =>{
      if(error){
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, errmsg:error.message})
      }
      else{
         if(!results.rows[0])
            return next (createCustomError(`No record exists with ticket_number: ${ticket_number}`, StatusCodes.NOT_FOUND))
         const dateDB = new Date(results.rows[0].issuing_date)
         results.rows[0].issuing_date = dateDB.toLocaleDateString()
         const difference_in_time = dateDB.getTime() - new Date().getTime()
         const fullday = Math.ceil(difference_in_time / (1000*3600*24))
         const hours = ((difference_in_time / (1000*3600*24)) - fullday) * 2
         if(fullday == 0)
            results.rows[0].days = Math.ceil(hours).toString().concat(" hrs") 
         console.log(dateDB.toLocaleTimeString() < new Date().toLocaleString)
         if(dateDB.getTime() > new Date().getTime())
         {
            results.rows[0].days = fullday + " Days"
            results.rows[0].flight_status = `Pending`
         }
            
         else if(dateDB.getTime() < new Date().getTime())
         {
            results.rows[0].days = "+" + (fullday* (-1)) + " Days"
            results.rows[0].flight_status = `Flown`
         }
         else
         {
            results.rows[0].days = "Today"
            results.rows[0].flight_status = `Boarding`
         }
         if(dateDB.toDateString() == new Date().toDateString())
            results.rows[0].flight_status = `Boarding`
         res.status(StatusCodes.OK).json({success: true, record: results.rows})
      }
   })
})
const updateRecord = asyncWrapper(async(req, res, next)=>{
   const {id:ticket_number} = req.params
   console.log(req.params);
   console.log(req.body);
   const query = `SELECT * FROM travel_ticket WHERE ticket_number = $1`
   await pool.query(query, [ticket_number],
   (error, results) =>{
      if(error){
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, errmsg:error.message})
      }
      else{
         if(!results.rows[0]){//record doesn't exist
            return next (createCustomError(`No record exists with ticket_number: ${ticket_number}`, StatusCodes.NOT_FOUND))
         }
         //record exists
         const {passenger_name, airline, amount, itinerary,  travel_type} = req.body
         let issuing_date = new Date(req.body.issuing_date).toUTCString()
         console.log(issuing_date);
         if(!passenger_name || !airline || !amount || !itinerary || !issuing_date || !travel_type)
            //any form field is empty
            return next (createCustomError(`Make sure no field is empty before continuing`, StatusCodes.FORBIDDEN))
         else{
            //update record
            //form fields are field
            const Uquery = `UPDATE travel_ticket SET passenger_name = $1, airline = $2, amount = $3, 
                              itinerary = $4, issuing_date = $5, travel_type = $6 WHERE ticket_number = $7`
            pool.query(Uquery, [passenger_name, airline, amount, itinerary, issuing_date, travel_type, ticket_number],
            (error, results) =>{
               if(error)
                  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, errmsg:error.message})
               else
                  res.status(StatusCodes.OK).json({success: true, msg: `ticket_number: ${ticket_number} has been successully updated`})
            })
         }
      }
   })
})
//delete record
const deleteRecord = asyncWrapper(async(req, res, next)=>{
   const {id:ticket_number} = req.params
   const query = `SELECT * FROM travel_ticket WHERE ticket_number = $1`
   await pool.query(query, [ticket_number],
   (error, results) =>{
      if(error){
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, errmsg:error.message})
      }
      else{
         if(!results.rows[0]){//record doesn't exist
            return next (createCustomError(`No record exists with ticket_number: ${ticket_number}`, StatusCodes.NOT_FOUND))
         }
         else{//record exists
            const Dquery = `DELETE FROM travel_ticket WHERE ticket_number = $1`
            pool.query(Dquery, [ticket_number], (error, results) => {
               if(error)
                  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, errmsg:error.message})
               else
                  res.status(StatusCodes.OK).json({success: true, msg: `ticket_number: ${ticket_number} has been deleted`})
            })
         }
      }
   })
})

const fileUpload = asyncWrapper(async(req, res) =>{
   console.log(req.body);
})
//utility functions
function getserialNumber(){
   const now = new Date()
   const serial = now.getDate().toString() + 
      (now.getMonth() + 1).toString() +
      now.getFullYear().toString() +
      now.getHours().toString() +
      now.getMinutes().toString() +
      now.getSeconds().toString()
   return serial
}
module.exports = { 
   getAllRecords,
   createNewRecord,
   getSingleRecord,
   updateRecord,
   deleteRecord,
   createMultipleRecords,
   fileUpload
}

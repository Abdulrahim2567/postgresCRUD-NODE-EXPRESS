const {getAllRecords, createNewRecord, getSingleRecord, updateRecord, deleteRecord, createMultipleRecords, fileUpload} = require('../controllers/queries')
const express = require ('express')
const router = express.Router()


router.route('/').get(getAllRecords).post(createNewRecord)
router.route('/:id').get(getSingleRecord).patch(updateRecord).delete(deleteRecord)
router.route('/bulk').post(createMultipleRecords)
router.route('/upload').post(fileUpload)

module.exports = router
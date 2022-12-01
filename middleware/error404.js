const notFound = (req, res)=> res.status(404).send('unknown route')

module.exports = notFound
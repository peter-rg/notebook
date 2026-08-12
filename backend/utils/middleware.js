const logger = require('./logger')

const unknownEndpoint = (req,res) => {
  res.status(404).send({
    error :'unknown endpoint'
  })
}

// notes validation
const validateNote=(req, res, next) => {
  const { content } = req.body
  if(!content){
    return res.status(400).json({ error: 'kindly provide content property' })
  }
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' })
  }
  if(content.trim().length <5){
    return res.status(400).json({ error: 'content cannot be less than 5 characters' })
  }

  next()
}

const errorHandler= (error, req, res, next) => {
  logger.error(error.message)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'Malformatted id' })
  }
  if(error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

const requestLogger = (req,res, next) => {
  logger.info('Method', req.method)
  logger.info('Path', req.path)
  logger.info('body', req.body)
  logger.info('---')

  next()
}

module.exports = { errorHandler, unknownEndpoint, requestLogger, validateNote }
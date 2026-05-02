const jwt = require('jsonwebtoken')
const { err } = require('../utils/response')

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return err(res, 'Unauthorized', 401)
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch {
    err(res, 'Invalid or expired token', 401)
  }
}

const operatorMiddleware = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return err(res, 'Unauthorized', 401)
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    if (decoded.role !== 'operator') return err(res, 'Forbidden', 403)
    req.operator = decoded
    next()
  } catch {
    err(res, 'Invalid or expired token', 401)
  }
}

module.exports = { authMiddleware, operatorMiddleware }

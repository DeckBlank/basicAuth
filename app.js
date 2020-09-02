require('dotenv').config({ path: '.env' })
var express = require('express');
import mongoose from 'mongoose'
import helmet from 'helmet'
const jwt = require('jsonwebtoken');
import cors from 'cors'
import corsOptions from './config/cors.js'

var app = express();
app.use(helmet())
app.use(express.json());
app.use(cors(corsOptions));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401).json({mensaje:"No tienes permisos"}) // if there isn't any token
  try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
       return res.status(403).json('No tienes permisos')
    }
  next()
}


const users = require('./routes/users');
app.use('/user',users);

module.exports = app;

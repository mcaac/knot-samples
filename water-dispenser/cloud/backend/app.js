const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socketio = require('socket.io');
const cors = require('cors');
const app = express();
const devices = require('./routes/devices');

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3003'
}));

const io = socketio();
app.io = io;
const subscribe = require('./routes/subscribe')(io);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/devices', devices);

// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler

app.use(function (err, req, res) {
// set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
// render the error page

// socket.io events
io.on('connection', (socket) => {
  console.log('A user connected'); // eslint-disable-line no-console
  socket.on('subscribe', client => subscribe(client));
});

module.exports = app; 

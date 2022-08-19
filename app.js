const express = require('express')
const path = require('path');

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./src/routes/index');
app.use('/api', indexRouter);

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`)
)
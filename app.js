const express = require('express');
const app = express();
const port = 3100;
// set use body json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// add route
const blogRoute = require('./routes/blog');
const userRoute = require('./routes/user');
app.use('/blog', blogRoute);
app.use('/user', userRoute);
// set port & run server
app.listen(port, () => console.log(`Server Start port : ${port}!`));

const express = require('express')
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('fs')
const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const resetPasswordRoutes = require('./routes/resetpassword')

const sequelize = require('./util/database')
const User = require('./models/users')
const Expense = require('./models/expense')
const Order = require('./models/orders')
const Forgotpassword = require('./models/forgotpassword')
const Downloadurl = require('./models/downloadurls');

const bcrypt = require('bcrypt')

const app = express()
app.use(cors())

app.use(bodyParser.json())

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
app.use('/password',resetPasswordRoutes)

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})

app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream: accessLogStream}))

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword)
Forgotpassword.belongsTo(User)

User.hasMany(Downloadurl);
Downloadurl.belongsTo(User);


sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000)
  })
  .catch((err) => {
    console.log(err)
  })

 

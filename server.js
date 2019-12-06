const path = require('path')
const url = require('url')
const chalk = require('chalk')
const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const app = express()
const router = express.Router()

//cookie 设置
const session = require('express-session');
const cookieParser = require('cookie-parser');

//数据库
const mongoose = require('mongoose')
const _ = require('underscore')

mongoose.connect('mongodb://localhost/mdbsTest')// 连接mongodb本地数据库mdbsTest

const viewPath = path.join(__dirname, './views/pages');
// view engine setup
app.set('views', path.join(viewPath));// 设置视图根目录
app.set('view engine', 'jade');// 设置默认模板引擎：jade

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));//bodyParser能够将表单数据进行格式化

//设置section
app.use(cookieParser()); 
app.use(session({ resave: false, saveUninitialized: false, secret: 'love' }));

app.use(express.static(path.join(__dirname,'public')))// 设置路径：public
app.locals.moment = require('moment')// 载入moment模块，格式化日期

//路由导入
const routers = require('./router')

//api导入
const apis = require('./api')

app.use(function (err, req, res, next) {
  err.status = err.status || 500
  res.status(err.status)
  res.send(err.message)
})

//mock
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV+ chalk.yellow(' dev server'))
  require('./data')(router)
} else if (process.env.NODE_ENV === 'api') {
    console.log(process.env.REMOTE_API+' api')
    router.use('/', function (req, res, next) {
        console.log(chalk.yellow(req.method + ' ' + req.url))
        console.log('http://' + process.env.REMOTE_API + req.url)
        if (req.method.toUpperCase() === 'GET') {
        request({
            qs: req.body,
            method: req.method,
            url: 'http://' + process.env.REMOTE_API + req.url,
            headers: req.headers
        }).pipe(res);
        } else if (req.method.toUpperCase() === 'POST') {
        request({
            form: req.body,
            method: req.method,
            url: 'http://' + process.env.REMOTE_API + req.url,
            headers: req.headers
        }).pipe(res);
        }
    });
}
routers(app);//路由
apis(app);//API
// 静态路由
// router.use('/', function (req, res) {
//   var filePath = req.path
//   if (/\.jade$/.test(filePath)) {
//     var fileName = filePath.replace(/(\/|\.jade)/g, '')
//     console.log(fileName)
//     res.render(fileName)
//   }
// })


const port = config.port || 3000

app.listen(port)
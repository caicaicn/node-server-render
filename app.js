var express = require('express')

var session = require('express-session');
var cookieParser = require('cookie-parser');

var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')

var Movie = require('./models/commodity.js')
var Users = require('./models/user.js')

//不同的表连接
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000  // 设置端口号：3000
var app = express()

mongoose.connect('mongodb://localhost/mdbsTest')// 连接mongodb本地数据库mdbsTest

app.set('views','./views/pages') // 设置视图根目录
app.set('view engine','jade') // 设置默认模板引擎：jade
app.use(bodyParser.urlencoded({extended:true})) //bodyParser能够将表单数据进行格式化
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json());

//设置section
app.use(cookieParser()); 
app.use(session({ resave: false, saveUninitialized: false, secret: 'love' }));

app.use(express.static(path.join(__dirname,'public')))// 设置路径：public
app.locals.moment = require('moment')// 载入moment模块，格式化日期
app.listen(port)

console.log('nodejs movies started on port ' + port)

// index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('web/index',{
			title: '首页',
			movies: movies
		})
	})
})

// detail page
// /:id 表示可以在req.params中拿到id的值
app.get('/movie/:id',function(req,res){
	var id = req.params.id
	Movie.findById(id,function(err,movie){
		if(!movie){
			res.redirect('/')
		}else{
			res.render('web/detail',{
				// title: '详情页',
				title: movie.title,
				movie: movie
			})
		}
	})
})

// admin page
app.get('/admin/movie',function(req,res){
	if(!req.session.sign){
		res.redirect('/')
	}else{
		res.render('admin',{
			title: '后台数据录入',
			movie: {
				title: '',
				doctor: '',
				country: '',
				year: '',
				poster: '',
				flash: '',
				summary: '',
				language: ''
			  }
		})
	}
})

// admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id
	console.log(id+' update')
	if(!req.session.sign){
		res.redirect('/')
	}else{
		if(id){
			Movie.findById(id,function(err,movie){
				console.log(movie)
				res.render('admin/infoUpdate',{
					title:'数据更新',
					movie:movie
				})
			})
		}
    }
})

// admin post movie
app.post('/admin/movie/new',function(req,res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	// 声明_movie变量
	console.log(movieObj)
	//判断数据类型
	if(isNaN(movieObj.year)){
        res.json({
		    success : '年份数据不合法，只能输入数字'
		});
	}else{
		//是否存在图片
		
		if(id !== 'undefined'){
			Movie.findById(id,function(err,movie){
				if(err){
					console.log(err)
				}
	
				_movie = _.extend(movie,movieObj) // _.extend用新对象里的字段替换老的字段
				_movie.save(function(err,movie){
					if(err){
						console.log(err)
					}
					res.redirect('/movie/' + movie._id)
				})
			})
		}
		else{
			_movie = new Movie({
				doctor:movieObj.doctor,
				title:movieObj.title,
				country:movieObj.country,
				language:movieObj.language,
				year:movieObj.year,
				poster:movieObj.poster,
				summary:movieObj.summary,
				flash:movieObj.flash
			})
	
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		}
	}
})

// list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('admin/list',{
			title: '列表页',
			movies: movies,
			session: req.session.sign
		})
	})
})

// list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	}
})

// user login
app.get('/admin/register',function(req,res){
	var type = [{name:'管理员',val:999},{name:'游客',val:1},{name:'编辑者',val:2}]

	// Users.findById(function(err,user){
	// 	console.log(user)
	// 	res.render('login',{
	// 		title: '用户录入',
	// 		user: ''
	// 	})
	// })
	if(req.session.sign){
		res.redirect('/')
	}else{
		res.render('admin/register',{
			title: '用户注册',
			user: ''
		})
	}
})

// user Sign
app.get('/admin/login',function(req,res){

	// Users.findById(function(err,signUser){
	// 	console.log(signUser)
	// 	res.render('sign',{
	// 		title: '用户登录',
	// 		signUser: ''
	// 	})
	// })
	if(req.session.sign){
		res.redirect('/')
	}else{
		res.render('admin/sign',{
			title: '用户登录',
			signUser: ''
		})
	}
})

// user sign 登录
app.post('/admin/sign',function(req,res){

	var userObj = { //用户数据集合
		userName: req.body.userName,
		userPwd: req.body.userPwd,
		userJurisdiction: '最高级别', //用户权限
		userType: req.body.userType, //用户类型
	}
	var _user

	// Users.fetch(function(err,user){
	// 	console.log(user)
	// 	var userData = user
	// 	for(var i=0; i<userData.length; i++){
	// 		if(userData[i].userName !== userObj.userName 
	// 		  && userData[i].userPwd !== userObj.userPwd){
	// 			res.json({code : 208, msg : '账号或密码错误'});// 若登录失败，重定向到登录页面
	// 		}else{
	// 			res.json({code : 200, msg : '登陆成功'});// 若登录失败，重定向到登录页面
	// 		}
	// 	}
	// })

	var name = userObj.userName
	var pass = userObj.userPwd

	Users.findOne({
        userName: name,
        userPwd: pass
    },
    function (err, user) {
    	console.log(user)
        if (user) {
            if (err) return res.json({code : 208, msg : '账号或密码错误'});
            // hash(pass, user.salt, function (err, hash) {
            //     if (err) return fn(err);
            //     if (hash == user.hash) return fn(null, user);
            //     res.json({code : 208, msg : '账号或密码错误'});
            // });
            req.session.sign = true;
            res.json({code : 200, msg : '登陆成功'});
        } else {
            res.json({code : 208, msg : '账号或密码错误'});
        }
    });

})

// user login 录入数据库
app.post('/admin/login/add',function(req,res){

	var user_id = req.body.userId

	var userObj = { //用户数据集合
		userName: req.body.userName,
		userPwd: req.body.userPwd,
		userJurisdiction: '最高级别', //用户权限
		userType: '管理员', //用户类型
	}
	var _user

	//用户注册
	Users.count({
        userName: userObj.userName
    }, function (err, count) {
    	console.log(count+' count')
        if (count === 0) {
            _user = new Users(userObj)
			console.log('数据插入')
			_user.save(function(err,user){
				if(err){
					console.log(err)
				}
				console.log(user)
				req.session.sign = true
				res.json({code : 200, msg : '注册成功'})
			})
        } else {//用户名存在
            res.json({code : 206, msg : '用户名已存在，请重新换个试试'});
        }
    });
})
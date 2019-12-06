/*
    api address
 */
const Movie = require('./models/commodity.js')
const Users = require('./models/user.js')

module.exports = function (app) {
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

    // list delete movie
    app.delete('/admin/list-del',function(req,res){
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

    // user sign 登录
    app.post('/admin/sign',function(req,res){
        console.log(req.body)
        
        var userObj = { //用户数据集合
            userName: req.body.userName,
            userPwd: req.body.userPwd,
            userJurisdiction: '最高级别', //用户权限
            userType: req.body.userType, //用户类型
        }
        var _user

        console.log(userObj)
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
}
//module.exports = app
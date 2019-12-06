/*
    静态路由
 */
const Movie = require('./models/commodity.js')
const Users = require('./models/user.js')
const express = require('express')
const router = express.Router()

module.exports = function (router) {
    // index page
    router.get('/',function(req,res){
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
    router.get('/movie/:id',function(req,res){
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
    router.get('/admin/movie',function(req,res){
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
    router.get('/admin/update/:id',function(req,res){
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

    // list page
    router.get('/admin/list',function(req,res){
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

    // user login
    router.get('/admin/register',function(req,res){
        var type = [{name:'管理员',val:999},{name:'游客',val:1},{name:'编辑者',val:2}]

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
    router.get('/admin/login',function(req,res){

        if(req.session.sign){
            res.redirect('/')
        }else{
            res.render('admin/sign',{
                title: '用户登录',
                signUser: ''
            })
        }
    })
    // user out
    router.get('/admin/login-out',function(req,res){

        if(req.session.sign){
            req.session.sign = false 
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    })
}
//module.exports = router
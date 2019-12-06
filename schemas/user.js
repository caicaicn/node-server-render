var mongoose = require('mongoose')

//用户表模型
var UserSchema = new mongoose.Schema({
	userName: String,
	userPwd: String,
	userJurisdiction: String, //用户权限
	userType: String, //用户类型
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

// 模式的pre方法表示每次save操作之前都会先调用这个方法， 判断数据是否新加的
UserSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
	next()
})

// 静态方法 ，不会与数据库直接进行交互，只有经过model实例化后才有这方法
// fetch方法取出目前数据库所有的数据
// findById方法用来查询单条数据
UserSchema.statics = {
	fetch:function(cb){
		return this
		  .find({})
		  .sort('meta.updateAt')
		  .exec(cb)
	},
	findById:function(id,cb){
		return this
		  .findOne({_id:id})
		  .exec(cb)
	}
}

// 将模式导出
module.exports = UserSchema
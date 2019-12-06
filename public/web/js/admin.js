$(function(){
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type:'DELETE',
			url:'/admin/list?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		})
	})

	//录入用户信息
	$('#loginAdd').click(function(e){
		var userName = $('#inputUser').val(),
			userPwd = $('#inputPwd').val();

		$.ajax({
			type:'POST',
			url:'/admin/login/add',
			data:{
				userName: userName,
				userPwd: userPwd,
				userId: $('#userId').val(),
				userJurisdiction: 1, //用户权限
				userType: '管理员用户', //用户类型
			}
		})
		.done(function(results){
			if(results.code === 200){
				console.log('添加成功')
				window.location.replace('/')
			}
		})
	})

	//用户登陆
	$('#sign').click(function(e){
		var userName = $('#inputUser').val(),
			userPwd = $('#inputPwd').val();

		$.ajax({
			type:'POST',
			url:'/admin/sign',
			data:{
				userName: userName,
				userPwd: userPwd,
				userId: '',
				userJurisdiction: 1, //用户权限
				userType: $("#userType").find("option:selected").val(), //用户类型
			}
		})
		.done(function(results){
			if(results.code === 200){
				console.log('登录成功')
				window.location.replace('/')
			}else{
				console.log(results)
			}
		})
	})
})
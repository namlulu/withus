var common_board = function(param) {
	var code = param.code;
	var no = param.no;
	var is_login = param.is_login;
	var nonMember_title = param.nonMember_title;

	/*
	 * 글 작성
	 *
	 * @param
	 */
	this.board_write = function(form) {
		if(!$(form).valid()){
			return false;
		}
		$("#btnSend").attr("disabled", true);
		$("#btnSend a").text("PROCESSING");
		form.submit();
	}

	/*
	 * 댓글 비밀번호 체크
	 *
	 * @param
	 */
	this.board_comment_password_check = function(idx) {
		var display_comment = $("#display_comment_"+ idx);

		if(!$("[name='password_"+ idx +"']", display_comment).val()) {
			alert("Please enter a password.");
			$("[name='password_"+ idx +"']", display_comment).focus();
			return false;
		}

		var set_data = {
			code : code,
			no : no,
			idx : idx,
			password : $("[name='password_"+ idx +"']", display_comment).val(),
		};

		$.ajax({
			url : "/board/comment_password_check",
			datatype : "json",
			type : "POST",
			data : set_data,
			success : function(response, status, request){
				if(status == "success") {
					if(request.readyState == "4" && request.status == "200") {
						var result = JSON.parse(response);
						if(result.code) {
							if(result.confirm) { // 일치
								var display_comment = $("#display_comment_"+ set_data.idx);
								if($("[name='mode_"+ set_data.idx +"']", display_comment).val() == "modify") { // 수정
									comment_modify_display(set_data.idx, true);
								} else { // 삭제
									Common_Board.board_comment_delete(set_data.idx);
								}
								return;
							} else { // 인증실패
								alert(result.msg);

							}
						} else { //error
							alert(result.error);
						}
					}
					comment_password_layer_close(set_data.idx);
				}
			}, error : function(request, status, error){
				alert("code:"+ request.status +"\n"+"message:"+ request.responseText +"\n"+"error:"+ error);
			}
		});
	}

	/*
	 * 댓글 작성
	 *
	 * @param
	 */
	this.board_comment_write = function(form) {
		if(!is_login) {
			if(!$("[name='nonMember']", form).is(":checked")) {
				alert(nonMember_title +" please check.");
				return false;
			}
		}

		if(!$(form).valid()){
			return false;
		}

		var set_data = {
			mode : "write",
			code : code,
			no : no,
			name : $("[name='name']", form).val(),
			content : $("[name='content']", form).val(),
			file_fname : $("[name='file_fname']", form).val(),
			file_oname : $("[name='file_oname']", form).val()
		};

		if(!is_login) {
			set_data.password = $("[name='password']", form).val();
		}

		$.ajax({
			url : "/board/board_comment_write",
			datatype : "json",
			type : "POST",
			data : set_data,
			success : function(response, status, request){
				if(status == "success") {
					if(request.readyState == "4" && request.status == "200") {
						var result = JSON.parse(response);
						if(result.code) {
							alert(result.msg);
							location.reload();
						} else {
							alert(result.error);
						}
					}
				}
			}, error : function(request, status, error){
				alert("code:"+ request.status +"\n"+"message:"+ request.responseText +"\n"+"error:"+ error);
			}
		});
	}

	/*
	 * 댓글 삭제
	 *
	 * @param
	 */
	this.board_comment_delete = function(idx) {
		if(!confirm("Are you sure you want to delete?")) {
			return false;
		}

		var display_comment = $("#display_comment_"+ idx);

		var set_data = {
			code : code,
			no : no,
			idx : idx
		};

		if(!is_login) {
			set_data.password = $("[name='password_"+ idx +"']", display_comment).val();
		}

		$.ajax({
			url : "/board/board_comment_delete",
			datatype : "json",
			type : "POST",
			data : set_data,
			success : function(response, status, request){
				if(status == "success") {
					if(request.readyState == "4" && request.status == "200") {
						var result = JSON.parse(response);
						if(result.code) {
							alert(result.msg);
							location.reload();
						} else {
							alert(result.error);
						}
					}
				}
			}, error : function(request, status, error){
				alert("code:"+ request.status +"\n"+"message:"+ request.responseText +"\n"+"error:"+ error);
			}
		});
	}

	/*
	 * 댓글 수정
	 *
	 * @param
	 */
	this.board_comment_modify = function(idx) {
		var display_comment = $("#display_comment_"+ idx);

		if(!$("[name='content_"+idx +"']", display_comment).val()) {
			alert("Please enter your content.");
			$("[name='content_"+idx +"']", display_comment).focus();
			return false;
		}

		var set_data = {
			mode : "modify",
			code : code,
			no : no,
			idx : idx,
			name : $("[name='name_"+ idx +"']", display_comment).val(),
			content : $("[name='content_"+ idx +"']", display_comment).val(),
			file_fname : $("[name='file_fname_"+ idx +"']", display_comment).val(),
			file_oname : $("[name='file_oname_"+ idx +"']", display_comment).val()
		};

		if(!is_login) {
			set_data.password = $("[name='password_"+ idx +"']", display_comment).val();
		}

		$.ajax({
			url : "/board/board_comment_write",
			datatype : "json",
			type : "POST",
			data : set_data,
			success : function(response, status, request){
				if(status == "success") {
					if(request.readyState == "4" && request.status == "200") {
						var result = JSON.parse(response);
						if(result.code) {
							alert(result.msg);
							location.reload();
						} else {
							alert(result.error);
						}
					}
				}
			}, error : function(request, status, error){
				alert("code:"+ request.status +"\n"+"message:"+ request.responseText +"\n"+"error:"+ error);
			}
		});
	}
};
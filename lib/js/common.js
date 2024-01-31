$(function() {
	/* 날짜 유효성 메소드추가 */
	$.validator.addMethod("dateValid",function(value, element) {
		return dateValidate(value);
	});

	/* 스마트에디터 유효성 메소드추가 */
	$.validator.addMethod("editorRequired",function(value, element) {
		return false;
	});
	
	/* 추가필드(ex1~20) 이메일 유효성 메소드추가 */
	$.validator.addMethod("addFieldCheckEmail",function(value, element) {
		return false;
	});

	/* 전화번호 유효성 메소드추가 */
	$.validator.addMethod("phoneValid",function(value, element) {
		return phoneValidate(value);
	});

	/* 영문|숫자만 입력가능 */
	$.validator.addMethod("onlyNumEngValid",function(value, element) {
		return onlyNumEngValidate(value);
	});

	/* 숫자|하이픈만 입력가능 */
	$.validator.addMethod("onlyNumHyphenValid",function(value, element) {
		return onlyNumHyphenValidate(value);
	});

	/* url 입력체크 */
	$.validator.addMethod("regUrlType",function(value, element) {
		console.log(value);
		console.log(element);
		return regUrlType(value);
	});

	/* 영문|숫자만 입력가능 */
	$.validator.addMethod("passwordValid",function(value, element) {
		return passwordValidate(value);
	});

	/* 만14세 미만 가입불가 */
	$.validator.addMethod("man14Valid",function(value, element) {
		return !(get_man_age(value) < 14);
	});

	$("#accessToken").on("click", function(e) {
		e.preventDefault();
		window.open("/admin/auth/access_token", "access token", "width=600, height=160, scrollbars=no");
	});
});

var email_rule = new RegExp("^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+", 'gi');

/**
 * 이메일 도메인 변경
 */
function domain_select_change(email) {
	var regex = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

	if(regex.test($("[name='"+ email +"_domain_select'] option:selected").val()) === true) {
        $("[name='"+ email +"_domain']").hide();
        $("[name='"+ email +"_domain']").val($("[name='"+ email +"_domain_select'] option:selected").val());
    } else {
        $("[name='"+ email +"_domain']").val("");
        $("[name='"+ email +"_domain']").show();
    }
}

/**
 * [getlist 페이징 이동 함수 (url 방식)]
 * @param  {[int]} currpage  [이동할 페이지]
 * @param  {[int]} roundpage [목록당 뿌려질 페이지]
 * @param  {[string]} id     [Adapter Query ID]
 * @return 페이지 이동
 *
 * 이 함수는 페이지 마다 overriding 될 수 있다
 */
function getlist(currpage,roundpage, id){
	if(!currpage){
		currpage = 1;
	}
	if(!roundpage){
		roundpage = 10;
	}

	var _tempUrl = document.location.href;
	var _temp = _tempUrl.split('?');

	var chk1=0;
	var chk2=0;
	var querystring = '';

	if(_temp[1]){
		var _tempArray = _temp[1].split('&');
		for(var i = 0, len = _tempArray.length; i < len; i++) {
			if(_tempArray[i]){
				var _keyValuePair = _tempArray[i].split('=');

				if(_keyValuePair[0] == 'currpage'){
					_keyValuePair[1] = currpage;
					chk1=1;
				}
				if(_keyValuePair[0] == 'roundpage'){
					_keyValuePair[1] = roundpage;
					chk2=1;
				}
				querystring += '&' + _keyValuePair[0] + '=' + _keyValuePair[1];
			}
		}
	}

	if(chk1===0){
		querystring += '&currpage='+currpage;
	}
	if(chk2===0){
		querystring += '&roundpage='+roundpage;
	}

	location.href='?'+querystring;
}

function checkToggle(ele, target) {
	$(":input[name='"+ target +"']").prop("checked", $(ele).is(":checked"));
}


function searchAddress(zip, addr, addr2){
	new daum.Postcode({
		oncomplete: function(data){
			var fullAddr = ''; // 최종 주소 변수
			var extraAddr = ''; // 조합형 주소 변수

			// 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
		    	fullAddr = data.roadAddress;
	        } else { // 사용자가 지번 주소를 선택했을 경우(J)
	            fullAddr = data.jibunAddress;
			}

			// 사용자가 선택한 주소가 도로명 타입일때 조합한다.
			if(data.userSelectedType === 'R'){
				//법정동명이 있을 경우 추가한다.
				if(data.bname !== ''){
					extraAddr += data.bname;
				}
				// 건물명이 있을 경우 추가한다.
				if(data.buildingName !== ''){
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
				}
				// 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
				fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
			 }

			// 우편번호와 주소 정보를 해당 필드에 넣는다.
			zip.value = data.zonecode;
			addr.value = fullAddr
			addr2.focus();
    	}
	}).open();
}

var oEditors = [];
var oFolder;
function attachSmartEditor(id, folder) {
	oFolder = folder;
	nhn.husky.EZCreator.createInIFrame({
		oAppRef: oEditors,
		elPlaceHolder: id,
		sSkinURI: "/lib/smarteditor2-master/workspace/static/SmartEditor2Skin.html",
		fCreator: "createSEditor2",
		htParams : {fOnBeforeUnload : function(){}}
	});
};

function getSmartEditor(id){
	oEditors.getById[id].exec("UPDATE_CONTENTS_FIELD", []);
	var value = oEditors.getById[id].getIR();

	if(value == "<p><br></p>") {
		value = "";
	}
	return value;
}

function selectCategory(category, level) { // 셀렉트 카테고리 셋팅
	$("#category"+ level).html('<option value="">=='+ level +'차 카테고리==</option>');

	if(!document.getElementById("category"+ level)) {
		return false;
	}

	if(level > 1) {
		var data = db.getDB({
			name : 'select.category.set',
			param : [level, level, (category || ""), level]
		});
	} else {
		var data = db.getDB({
			name : 'select.category.set.first',
			param : [level]
		});
	}

	if(data.code && data.data) {
		var str = '';
		var selectOption = (category || "").substr(0, level * 3);
		for(var i = 0; i < data.data.length; i++) {
			var row = data.data[i]
			str += '<option value="'+ row.CATEGORY +'" '+ (row.CATEGORY == selectOption ? 'selected' : '') +'>'+ row.CATEGORYNM +'</option>';
		}
		$("#category"+ level).append(str);
	}

	selectCategory(category, level + 1);
}

// https://gist.github.com/faisalman/879208
function print_r(obj, t) {
	var tab = t || '';
	var isArr = Object.prototype.toString.call(obj) === '[object Array]';
	var str = isArr ? ('Array\n' + tab + '[\n') : ('Object\n' + tab + '{\n');

	for (var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
			var val1 = obj[prop];
			var val2 = '';
			var type = Object.prototype.toString.call(val1);
			switch (type) {
				case '[object Array]':
				case '[object Object]':
				val2 = print_r(val1, (tab + '\t'));
				break;

				case '[object String]':
				val2 = '\'' + val1 + '\'';
				console.log(val2);
				break;

				default:
				val2 = val1;
			}
			str += tab + '\t' + prop + ' => ' + val2 + ',\n';
		}
	}

	str = str.substring(0, str.length - 2) + '\n' + tab;

	return isArr ? (str + ']') : (str + '}');
}

function debug(p, isJson){
	var xmp = document.createElement('xmp');
	xmp.innerHTML = isJson===true ? JSON.stringify(p, null, 4) : print_r(p);
	xmp.style.cssText = "display:block; font:9pt 'Bitstream Vera Sans Mono, Courier New'; background:#202020; color:#D2FFD2; padding:10px; margin:5px; white-space:normal;";
	document.body.appendChild(xmp);
}

var strip_tags = function(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

function htmlspecialchars(str) {
	if (typeof(str) == "string") {
		str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#039;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
	}
	return str;
}


var emailValidate = function(email){
	//if(!/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email)){
	if(!/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/i.test(email)){
		return false;
	}else{
		return true;
	}
};

//날짜체크
var dateValidate = function(str){
	// STRING FORMAT yyyy-mm-dd
	if(str=="" || str==null){return false;}

	// m[1] is year 'YYYY' * m[2] is month 'MM' * m[3] is day 'DD'
	var m = str.match(/(\d{4})-(\d{2})-(\d{2})/);

	// STR IS NOT FIT m IS NOT OBJECT
	if( m === null || typeof m !== 'object'){return false;}

	// CHECK m TYPE
	if (typeof m !== 'object' && m !== null && m.size!==3){return false;}

	var ret = true; //RETURN VALUE

	// YEAR CHECK
	if(m[1].length < 4){ret = false;}
	// MONTH CHECK
	if( (m[2].length < 2) || m[2] < 1 || m[2] > 12){ret = false;}
	// DAY CHECK
	if( (m[3].length < 2) || m[3] < 1 || m[3] > 31){ret = false;}

	return ret;
}

/*
* 생년월일로 (만)나이 구하기
* @PARAM 생년월일
* @PARAM 현재날짜
* @return CONSOLE.LOG
*/
function get_man_age(birthday, today) {
	birthday = moment(birthday).format("YYYY-MM-DD");
	if(today) {
		today = moment(today).format("YYYY-MM-DD");
	} else {
		today = moment(CURRENT_DATE).format("YYYY-MM-DD");
	}

	var birthday = new Date(birthday);
	var today = new Date(today);
	var age = today.getFullYear() - birthday.getFullYear();

	birthday.setFullYear(today.getFullYear());

	if (today < birthday) {
		age--;
	}

	return age;
}



var phoneValidate =  function(str){
	return str.match(/^\d{2,3}-\d{3,4}-\d{4}$/);
}

//한글 입력체크
var hangulValidate = function(str){
	return str.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);
}

//영어숫자 입력체크
var onlyNumEngValidate = function(str){
	return !str.match(/[^a-zA-Z0-9]/);
}

//숫자,하이픈 입력체크
var onlyNumHyphenValidate = function(str){
	return !str.match(/[^0-9|\-]/);
}

//url 입력체크
var regUrlType = function(str) {
	var regex = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?/;
	return regex.test(str);
}

var passwordValidate = function(str){
	var pattern = /[0-9]/;
	var pattern2 = /[a-z]/;
	var pattern3 = /[~!@#$%^&*()_\\\-\+=|<>?:{}]/; // 원하는 특수문자 추가 제거
	var pattern4 = /[A-Z]/;
	var cnt_pattern = 0;

	if(pattern.test(str)) {
		cnt_pattern++;
	}

	if(pattern2.test(str)) {
		cnt_pattern++;
	}

	if(pattern3.test(str)) {
		cnt_pattern++;
	}

	if(pattern4.test(str)) {
		cnt_pattern++;
	}

	return cnt_pattern >= 2;
}

/* CI UPLOAD */
var uploadAction = "/FileRequest/upload";
var removeAction = "/FileRequest/remove";

var uploadForm = {
	html5UploadPossible : window.FormData ? true : false,
	init : function (form) {
		if (form.admin_page_flag){
			if (uploadAction.indexOf('admin') == -1){
				uploadAction = '/admin'+uploadAction;
			}
			if (removeAction.indexOf('admin') == -1){
				removeAction = '/admin'+removeAction;
			}
		}

		// 20200424 업로드 POST 데이터 초과 시, 파일 누락 정보 서칭을 위함.
		var codeEle = document.querySelector("input[name=code]");
		var sizeEle = document.querySelector("input[name=file1_size]");
		if(codeEle != null && codeEle.value && sizeEle != null && sizeEle.value) {
			uploadAction = uploadAction + "?code=" + codeEle.value + "&size=" + sizeEle.value;
		}

		this.upload({
			target : form.id,
			type : form.type ? form.type.value : "",
			folder : form.folder ? form.folder.value : ""
		}, function(result, ele) {
			if(!result.error){
				var elename = ele.name;
				var fname = '';
				var oname = '';
				var a = '';
				var prevFname = '';
				if(result.data){
					var node = result.data;
					fname = node.file_name;
					oname = node.client_name;
					a = '<a href="/fileRequest/download?file='+encodeURI(node.folder.replace("/upload", "")+"/"+fname)+'" target="_blank" style="color:cornflowerblue;">'+oname+'</a>';
					a += '<a href="javascript://" onclick="uploadForm.uploadRemove(\''+ elename +'\')" class="file_no"><img src="/lib/images/btn_close.gif"></a>';
				}
				var upload_path = node.folder.split("/");

				$("[name='"+ elename +"']").wrap('<form>').closest('form').get(0).reset();
				$("[name='"+ elename +"']").unwrap();
				if($("[name='"+ elename +"_fname']").length > 0){
					prevFname = $("[name='"+ elename +"_fname']").val();
					$("[name='"+ elename +"_fname']").val(fname);
				}else{
					var parent_tr = $("[name='"+ elename +"']").closest("tr");

					if(parent_tr.hasClass("detail_tr")){
						prevFname = parent_tr.find("[name='detail_fname[]']").val();
						parent_tr.find("[name='detail_fname[]']").val(fname);
					}
				}

				if($("[name='"+ elename +"_oname']").length > 0){
					$("[name='"+ elename +"_oname']").val(oname);
				}else{
					var parent_tr = $("[name='"+ elename +"']").closest("tr");

					if(parent_tr.hasClass("detail_tr")){
						parent_tr.find("[name='detail_oname[]']").val(oname);
					}
				}

				//썸네일 대표이미지
				if($("[name='"+ elename +"_image']").length > 0) {
						if ($("[name='"+ elename +"_image']").is(":checked")) {
								prevFname = $("[name='"+ elename +"_image']").val();
								$("[name='"+ elename +"_image']").val(fname);
						} 
				}

				$("[name='"+ elename +"_filezone'], #"+ elename +"_filezone").html(a);
				$("[name='upload_path']").val(upload_path[upload_path.length - 1]);
				if(($("#"+ elename +"_filezone").closest('tr').find('[type=hidden][name$=_fname]').last().length || $("#"+ elename +"_filezone").closest('tr').find('[type=hidden][name$="_fname[]"]').last().length) && prevFname != ""){
					// ajax 처리
					$.ajax({
						url : removeAction,
						method : 'post',
						data : {"folder" : $("#"+ elename +"_filezone").closest('tr').find('[type=hidden][name$=_folder]').last().val(), "fname" : prevFname},
						dataType : 'json',
						success : function(data){
							console.log(data);
							console.log("file remove success");
						},
						error : function(xhr, status, error){
							console.log("file remove error");
						}
					});
				}
			}else{
				$(ele).val("");
				alert(result.error);

			}
		});
	},
	uploadRemove : function(ele) {
		var fname;
		if($("#"+ ele +"_filezone").closest('tr').find('[type=hidden][name$=_fname]').last().length > 0){
			fname = $("#"+ ele +"_filezone").closest('tr').find('[name$=_fname]').last().val();
		}else if($("#"+ ele +"_filezone").closest('tr').find('[type=hidden][name$="_fname[]"]').last().length > 0){
			fname = $("#"+ ele +"_filezone").closest('tr').find('[name$="_fname[]"]').last().val();
		}
		if($("[name='"+ ele +"_fname']").length > 0){
			$("[name='"+ ele +"_fname']").val("");
		}else{
			var parent_tr = $("[name='"+ ele +"']").closest("tr");

			if(parent_tr.hasClass("detail_tr")){
				parent_tr.find("[name='detail_fname[]']").val("");
			}
		}

		if($("[name='"+ ele +"_oname']").length > 0){
			$("[name='"+ ele +"_oname']").val("");
		}else{
			var parent_tr = $("[name='"+ ele +"']").closest("tr");

			if(parent_tr.hasClass("detail_tr")){
				parent_tr.find("[name='detail_fname[]']").val("");
			}
		}

		//썸네일 대표이미지 (삭제시 체크 해제기능)
		if($("[name='"+ ele +"_image']").length > 0) {
			if ($("[name='"+ ele +"_image']").is(":checked")) {
				$("[name='"+ ele +"_image']").prop("checked", false);
			}
		}

		$("#"+ ele +"_filezone").html("");
		
		// @todo @James 실제 업로드된 파일 삭제 필요
		if(($("#"+ ele +"_filezone").closest('tr').find('[type=hidden][name$=_fname]').last().length || $("#"+ ele +"_filezone").closest('tr').find('[type=hidden][name$="_fname[]"]').last().length) && fname){
			// ajax 처리
			$.ajax({
				url : removeAction,
				method : 'post',
				data : {"folder" : $("#"+ ele +"_filezone").closest('tr').find('[type=hidden][name$=_folder]').last().val(), "fname" : fname},
				dataType : 'json',
				success : function(data){
					console.log(data);
					console.log("file remove success");
				},
				error : function(xhr, status, error){
					console.log("file remove error");
				}
			});
		}
	},

	/**
	 * [upload 비동기 파일 업로드]
	 * @param  {[object]}   option   [target : 타겟 인풋
	 *                             	type : 'image|video|document|excel'
	 *                             	size : '최대 사이즈 MB',
	 *                             	pixel : image일 경우 {width : 가로 사이즈, height: 세로 사이즈}
	 *                             	]
	 * @param  {Function} callback [후처리 함수]
	 */
	upload : function(option, callback) {
		if(option.target){
			if(this.html5UploadPossible){
				$(':file', '#'+option.target).on('change',function(e){

					if(option.resize_height){
						option.resize_height = 0;
					}

					if(option.resize_width){
						option.resize_width = 0;
					}
					var target = this;
					var file = target && target.files && target.files[0];

					if($("[name='"+target.name+"_folder']").val()) {
						option.folder = $("[name='"+target.name+"_folder']").val();
					}
					if($("[name='"+target.name+"_type']").val()) {
						option.type = $("[name='"+target.name+"_type']").val();
					}

					if($("[name='"+target.name+"_size']").val()) {
						option.size = $("[name='"+target.name+"_size']").val();
					} else {
						// option.size가 유지되어 이전에 업로드한 file input의 size가 설정되는 버그 고침 2020-06-19
						option.size = undefined;
					}

					if($("[name='"+target.name+"_pixel']").val()) {
						option.pixel = [];
						option.pixel[0] = $("[name='"+target.name+"_pixel']:eq(0)").val();
						option.pixel[1] = $("[name='"+target.name+"_pixel']:eq(1)").val();
					}

					//이미지 리사이즈용 width,height 추가
					if($("[name='"+target.name+"_width']").val()){
						option.resize_width = $("[name='"+target.name+"_width']:eq(0)").val()
					}

					if($("[name='"+target.name+"_height']").val()){
						option.resize_height = $("[name='"+target.name+"_height']:eq(0)").val()
					}

					var formData = new FormData();
					formData.append('file', file);
					formData.append('folder', option.folder);

					//이미지 리사이즈용 width,height 추가
					if(option.resize_width){
						formData.append('resize_width',option.resize_width);
					}

					if(option.resize_height){
						formData.append('resize_height',option.resize_height);
					}

					if(option.type){
						formData.append('type', option.type);
					}
					if(option.size){
						formData.append('size', option.size);
					}
					if(option.pixel){
						formData.append('width', option.pixel[0]);
						formData.append('height', option.pixel[1]);
					}

					$.ajax({
						url : uploadAction,
						method : 'post',
						data : formData,
						dataType : 'json',
						contentType : false,
						processData : false
					})
					.then(function(result){
						callback(result, target);
					});
				});
			}else{
				$(':file', '#'+option.target).on('change',function(e){
					var target = this;
					var $input = $(target);
					var t = new Date().getTime();

					var jaTarget = 'JA_Form'+t;
					$input.wrap($('<form/>', {
							id : jaTarget,
							action : uploadAction,
							method : 'post',
							enctype : 'multipart/form-data',
							target : jaTarget
						}
					));

					if($("[name='"+ target.name +"_folder']").val()) {
						option.folder = $("[name='"+target.name+"_folder']").val();
					}
					if($("[name='"+ target.name +"_type']").val()) {
						option.type = $("[name='"+target.name+"_type']").val();
					}

					if($("[name='"+ target.name +"_size']").val()) {
						option.size = $("[name='"+target.name+"_size']").val();
					}

					if($("[name='"+ target.name +"_pixel']").val()) {
						option.pixel = [];
						option.pixel[0] = $("[name='"+target.name+"_pixel']:eq(0)").val();
						option.pixel[1] = $("[name='"+target.name+"_pixel']:eq(1)").val();
					}

					var $form = $('#'+jaTarget);
					$form.append(dummyInput('folder',option.folder, t));
					if(option.type){
						$form.append(dummyInput('type',option.type, t));
					}
					if(option.size){
						$form.append(dummyInput('size',option.size, t));
					}
					if(option.pixel){
						$form.append(dummyInput('width',option.pixel[0], t));
						$form.append(dummyInput('height',option.pixel[1], t));
					}

					var $iframe = $('<iframe/>',{name:jaTarget,style:'display:none;'}).appendTo('body');

					$iframe.load(function(){
						var doc = this.contentWindow ? this.contentWindow.document : (this.contentDocument ? this.contentDocument : this.document);
						var root = doc.documentElement ? doc.documentElement : doc.body;
						var result = root.textContent ? root.textContent : root.innerText;
						callback(JSON.parse(result), target);

						$input.unwrap($form);
						$('.JA_Dummy'+t).remove();
						$iframe.remove();
					});

					$form.submit();
				});
			}
		} else {
			console.log('upload parameter error');
		}
	}
};

// input 자동채우기
input_fill = function(obj, opt, bool){
	Object.keys(obj || {}).forEach(function(key) {
		var $k = $('[name="'+key.toLowerCase()+'"]');
		if($k.length){
			switch ($k.get(0).tagName) {
				case 'INPUT':
					var t = $k.prop('type');
					if(t==='radio' || t==='checkbox'){
						$k.filter('[value="'+obj[key]+'"]').prop('checked',true);
					} else if(t==='file'){
						var $f = $('[name="'+key.toLowerCase()+'_fname"]');
						var $z = $('[name="'+ key.toLowerCase() +'_filezone"] ,#'+key.toLowerCase()+'_filezone');
						var $d = $('[name="'+key.toLowerCase()+'_folder"]').val();
						$f.val(obj[key]);
						if(obj[key]) {
							$z.html('<a href="/fileRequest/download?file='+encodeURI($d.replace("/upload", "")+"/"+obj[key])+'" target="_blank" style="color:cornflowerblue;">'+obj[key]+'</a><a href="javascript://" onclick="uploadForm.uploadRemove(\''+ key.toLowerCase() +'\')" class="file_no"><img src="/lib/images/btn_close.gif"></a>');
						}
					} else{
						if(t !== 'password') {
							$k.val(obj[key]);
						}
					}
				break;
				case 'SELECT':
					$k.val(obj[key]);
				break;
				case 'TEXTAREA':
					if(opt && opt[key]){
						if(bool){
							opt[key](obj[key]);
						}else{
							$k.val(opt[key](obj[key]));
						}
					}else{
						$k.val(obj[key]);
					}
				break;
				default:
					if(opt && opt[key]){
						if(bool){
							opt[key](obj[key]);
						}else{
							$k.html(opt[key](obj[key]));
						}
					}else{
						$k.html(obj[key]);
					}
				break;
			}
		}
	});
};

/* Cookie */
var Cookie = {
	getCookie : function(cookie_key){
		var i, x, y, z, cookies = document.cookie.split(';');
		for(i=0; i<cookies.length; i++){
			z = cookies[i].indexOf('=');
			x = cookies[i].substr(0, z);
			y = cookies[i].substr(z+1);
			x = x.replace(/^\s+|\s+$/g,'');
			if(x === cookie_key){
				return unescape(y);
			}
		}
	},
	setCookie : function(cookie_key, value, exdays){
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays == null)? "" : "; expires="+exdate.toUTCString());
		document.cookie = cookie_key + "=" + c_value;
	}
};

/**
 * [jQuery Utils]
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {
	$.fn.serializeObject = function () {
		"use strict";

		var result = {};
		var extend = function (i, element) {
			var node = result[element.name];

			if ('undefined' !== typeof node && node !== null) {
				if ($.isArray(node)) {
					node.push(element.value);
				} else {
					result[element.name] = [node, element.value];
				}
			} else {
				result[element.name] = element.value;
			}
		};

		$.each(this.serializeArray(), extend);
		return result;
	};

	$.fn.alterClass = function ( removals, additions ) {

		var self = this;

		if ( removals.indexOf( '*' ) === -1 ) {
			self.removeClass( removals );
			return !additions ? self : self.addClass( additions );
		}

		var patt = new RegExp( '\\s' +
				removals.
					replace( /\*/g, '[A-Za-z0-9-_]+' ).
					split( ' ' ).
					join( '\\s|\\s' ) +
				'\\s', 'g' );

		self.each( function ( i, it ) {
			var cn = ' ' + it.className + ' ';
			while ( patt.test( cn ) ) {
				cn = cn.replace( patt, ' ' );
			}
			it.className = $.trim( cn );
		});

		return !additions ? self : self.addClass( additions );
	};

	$.ajaxTransport("+binary", function(options, originalOptions, jqXHR) {
		if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
			return {
				send: function(headers, callback) {
					var xhr = new XMLHttpRequest(),
					url = options.url,
					type = options.type,
					async = options.async || true,
					dataType = options.responseType || "blob",
					data = options.data || null,
					username = options.username || null,
					password = options.password || null;

					xhr.addEventListener('load', function() {
						var data = {};
						data[options.dataType] = xhr.response;
						callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
					});

					xhr.open(type, url, async, username, password);

					for (var i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					xhr.responseType = dataType;
					xhr.send(data);
				},
				abort: function() {}
			};
		}
	});

	$.fn.clearForm = function() {
		return this.each(function() {
			var type = this.type, tag = this.tagName.toLowerCase();
			if (tag === 'form'){
				return $(':input',this).clearForm();
			}
			if (type === 'text' || type === 'password' || type === 'hidden' || tag === 'textarea'){
				this.value = '';
			}else if (type === 'checkbox' || type === 'radio'){
				this.checked = false;
			}else if (tag === 'select'){
				this.selectedIndex = -1;
			}
		});
	};
}));
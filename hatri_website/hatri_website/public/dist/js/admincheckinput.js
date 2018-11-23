$(document).ready(function () {
    /*ĐỊNH NGHĨA ĐỂ XÉT TRƯỜNG HỢP CHƯA CHỌN SELECT*/
    $.validator.setDefaults({
        errorClass: 'help-block',
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });
    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg != value;
    }, "Value must not equal arg.");
    $.validator.addMethod("isEmail", function (value, element) {
        if (/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value)) {
            return true;
        } else {
            return false;
        };
    }, "Email không hợp lệ");
    /*Người dùng*/
	$("#frmUser").validate({
		rules: {
			role_id:{
				valueNotEquals: "-1",
			},
			user_fullName: {
				required: true,
				minlength: 5,
				maxlength: 50,
			},
			user_userName: {
				required: true,
				minlength: 5,
				maxlength: 50,
			},
			user_password: {
				required: true,
				minlength: 5,
				maxlength: 100,
			},
			re_user_password: {
				required: true,
				equalTo: "#user_password",
			},
			user_birthday: {
				required: true,
			},
			user_phone: {
				required: true,
				minlength: 9,
				maxlength: 11,
			},
			user_email: {
                required: true,
                isEmail: true,
				minlength: 3,
				maxlength: 100,
			},
			user_address: {
				required: true,
				minlength: 3,
				maxlength: 100,
			},
			
		},
		messages: {
			role_id: {
				valueNotEquals: "Vui lòng chọn quyền",
			},
			user_fullName: {
				required: 'Tên người dùng không được rỗng',
				minlength: 'Tên người dùng phải có ít nhất 5 kí tự',
				maxlength: 'Tên người dùng không được vượt quá 50 kí tự',
			},
			user_userName: {
				required: 'Tài khoản người dùng không được rỗng',
				minlength: 'Tài khoản người dùng phải có ít nhất 5 kí tự',
				maxlength: 'Tài khoản người dùng không được vượt quá 50 kí tự',
			},
			user_password: {
				required: 'Mật khẩu người dùng không được rỗng',
				minlength: 'Mật khẩu người dùng phải có ít nhất 5 kí tự',
				maxlength: 'Mật khẩu người dùng không được vượt quá 100 kí tự',
			},
			re_user_password: {
				required: 'Nhập lại mật khẩu người dùng không được rỗng',
				equalTo: 'Không trùng khớp với mật khẩu',
			},
			user_birthday: {
				required: 'Ngày sinh người dùng không được rỗng',
			},
			user_phone: {
				required: 'Số điện thoại người dùng không được rỗng',
				minlength: 'Số điện thoại người dùng phải có ít nhất 10 kí tự',
				maxlength: 'Số điện thoại người dùng không được vượt quá 11 kí tự',
			},
			user_email: {
				required: 'Email người dùng không được rỗng',
				minlength: 'Email người dùng phải có ít nhất 3 kí tự',
                maxlength: 'Email người dùng không được vượt quá 100 kí tự',
                isEmail: 'Email không hợp lệ'
			},
			user_address: {
				required: 'Địa chỉ người dùng không được rỗng',
				minlength: 'Địa chỉ người dùng phải có ít nhất 4 kí tự',
				maxlength: 'Địa chỉ người dùng không được vượt quá 100 kí tự',
			},
			
		},
		//in loi ra giao dien
		errorPlacement: function($error, $element) {
			var name = $element.attr("name");
			$("#error" + name).append($error);
		}
	});
}); //end 
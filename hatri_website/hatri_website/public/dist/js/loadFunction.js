var queue = []; //Mảng để chờ load dữ liệu

//ham lay ve danh sach quyen
function loadAllRole(config, token, secu, callback) {
	var arrayDTType = [];
	var arrayDTTId = [];
	queue.push(1);
	$.ajax({
		url: config + '/api/role/getAll',
		type: 'GET',
		headers: {'Authorization': secu + token},
		contentType: 'application/json;charset=utf-8',
		success: function (resultdata) {
			resultdata.data.forEach(function (data, index) {
				arrayDTTId.push(data.role_id);
				arrayDTType[data.role_id] = [];
				arrayDTType[data.role_id].unshift({ role_id: data.role_id, role_name: data.role_name });
			});
			arrayDTTId.sort(); /*Sắp xếp mảng loại dữ liệu*/
		},
		error: function (jqXHR, textStatus, errorThrown) {
			// displayError("Không thể tải được dữ liệu của quyền. Vui lòng tải lại trang");
		},
	}).complete(function () {
		queue.pop();
		if (queue.length == 0) {
			callback(arrayDTTId, arrayDTType);
		}
	});
}

//hàm lấy danh sách user
function getListUser(config, token, secu ) {
	var html = "";
	jQuery.ajax({
		url: config + '/api/user/getAll',
		type: 'GET',
		headers: {'Authorization': secu + token},
		contentType: 'application/json; charset=utf-8',
		success: function (resultdata) {
			if (resultdata.data != null) {
				resultdata.data.forEach(function (items) {
					html += '<tr>';
					html += '<td>' + items.user_fullName + '</td>';
					html += '<td>' + items.user_userName + '</td>';
					html += '<td>Ngày sinh: ' + moment(items.user_birthday).format('DD/MM/YYYY') + '</br>Số điện thoại:&nbsp' + items.user_phoneNumber + '</br>Email: ' + items.user_email + '</td>';
					if (items.user_lockStatus) {
						html += '<td><a onclick="unlockUser(' + "'" + config + "'" + ',' + "'" + token + "'" + ',' + "'" + secu + "'" + ',' + "'" + items.user_id + "'" + ')" title="Mở khóa" href="#"><span><i class="fa fa-lock" style="font-size:26px"></i></span></a></td>';
					} else {
						html += '<td><a onclick="lockUser(' + "'" + config + "'" + ',' + "'" + token + "'" + ',' + "'" + secu + "'" + ',' + "'" + items.user_id + "'" + ')" title="Khóa" href="#"><span><i class="fa fa-unlock" style="font-size:26px"></i></span></a></td>'
					};
					html += "<td><a title='Cập nhật thông tin người dùng' href='/trangchu/trangquantri/sua/" + items.user_id + "'>";
					html += "<span class='fa fa-edit' style='font-size:26px'></a></td>";
					html += '</tr>';
				});
				$("#hienthidsnguoidung").html(html);
			}
		},
		error: function (jqXHR, error, errorThrown) {
			// displayError("Lỗi ! Không thể tải danh sách người dùng. Vui lòng tải lại trang");
		},
	});

}
//hàm khóa tài khoản user
function lockUser(config, token, secu, userId) {
	if (confirm_edit() == true) {
		jQuery.ajax({
			url: config + '/api/user/lockuser/' + userId,
			type: 'PUT',
			headers: {'Authorization': secu + token},
			contentType: 'application/json; charset=utf-8',
			success: function (data, textStatus, jqXHR) {
				console.log("Data " + data + " ,status: " + textStatus);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log("msg: " + thrownError.message + " , status: " + xhr.status);
			}
		});
		location.reload();
	}
}
//hàm mở tài khoản user
function unlockUser(config, token, secu, userId) {
	if (confirm_edit() == true) {
		jQuery.ajax({
			url: config + '/api/user/unlockuser/' + userId,
			type: 'PUT',
			headers: {'Authorization': secu + token},
			contentType: 'application/json; charset=utf-8',
			success: function (data, textStatus, jqXHR) {
				console.log("Data " + data + " ,status: " + textStatus);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log("msg: " + thrownError.message + " , status: " + xhr.status);
			}
		});
		location.reload();
	}
}

function searchUserByKeyWord(config,token,secu) {
	var html = "";
	var keyword = "";
	if ($("#txtTimKiem").val() != '') {
		$('.pagi-custom').hide();
		keyword = $("#txtTimKiem").val();
		jQuery.ajax({
			url: config + '/api/user/getAllByKeyWord/' + keyword,
			type: 'GET',
			headers: {'Authorization': secu + token},
			contentType: 'application/json; charset=utf-8',
			success: function (resultdata) {
				if (resultdata.data != null) {
					resultdata.data.forEach(function (items) {
						html += '<tr>';
						html += '<td>' + items.user_fullName + '</td>';
						html += '<td>' + items.user_userName + '</td>';
						html += '<td>Ngày sinh: ' + moment(items.user_birthday).format('DD/MM/YYYY') + '</br>Số điện thoại:&nbsp' + items.user_phoneNumber + '</br>Email: ' + items.user_email + '</td>';
						if (items.user_lockStatus) {
							html += '<td><a onclick="unlockUser(' + "'" + config + "'" + ',' + "'" + items.user_id + "'" + ')" title="Mở khóa" href="#"><span><i class="fa fa-lock" style="font-size:26px"></i></span></a></td>';
						} else {
							html += '<td><a onclick="lockUser(' + "'" + config + "'" + ',' + "'" + items.user_id + "'" + ')" title="Khóa" href="#"><span><i class="fa fa-unlock" style="font-size:26px"></i></span></a></td>'
						};
						html += "<td><a title='Cập nhật thông tin người dùng' href='/trangchu/trangquantri/sua/" + items.user_id + "'>";
						html += "<span class='fa fa-edit' style='font-size:26px'></a></td>";
						html += '</tr>';
					});
					$("#hienthidsnguoidung").html(html);
				}
			},
			error: function (jqXHR, error, errorThrown) {
				// displayError("Lỗi ! Không thể tải danh sách người dùng. Vui lòng tải lại trang");
			},
		});
	} else {
		getListUser(config,token,secu);
	}

}

function confirm_edit() {
	return confirm('Bạn có chắc chắn thay đổi không?');
}
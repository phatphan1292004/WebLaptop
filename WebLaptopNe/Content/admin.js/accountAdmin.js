$(document).ready(function () {
    // Khởi tạo DataTable
    const table = $('#account-table').DataTable({
        ajax: {
            url: '/Admin/GetAccount', // URL API
            type: "GET", // Phương thức HTTP
            dataSrc: '', // DataTables tự hiểu JSON không cần root
            data: function (d) {
                d.searchValue = $("#account-search").val(); // Lấy giá trị tìm kiếm từ input
            },
        },
        destroy: true,
        autoWidth: false,
        paging: true, // Bật phân trang
        pageLength: 10, // Số mục trên mỗi trang
        columns: [
            { data: 'UserId'},
            { data: 'Username'},
            { data: 'Email' },
            {
                data: 'CreatedAt',
                render: function (data) {
                    const timestamp = parseInt(data.match(/\d+/)[0]);
                    const date = new Date(timestamp);

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                }
            },
            { data: 'Role' },
            {
                data: null,
                render: function (data, type, row) {
                    return `<button class="view-details" data-id="${row.UserId}"" >Xem chi tiết</button>
                            <button class="delete-account" data-id="${row.UserId}">Xóa</button>
                    `;
                }
            },
            ],   
        responsive: true,
        lengthChange: false,
        searching: false,
        ordering: true,
        info: true,
        language: {
            paginate: {
                first: "Đầu tiên",
                last: "Cuối cùng",
                next: "Tiếp",
                previous: "Trước"
            },
            lengthMenu: "Hiển thị _MENU_ mục",
            info: "Hiển thị _START_ đến _END_ trong tổng _TOTAL_ mục",
            emptyTable: "Không có dữ liệu để hiển thị"
        }
    });

    // Nút tìm kiếm
    $("#search-btn-account").on("click", function () {
        table.ajax.reload(); // Reload dữ liệu khi tìm kiếm
    });

    $('#add-account-form').on('submit', function (e) {
        e.preventDefault();

        // Kiểm tra các giá trị null hoặc rỗng trước khi gửi
        const formData = {
            cus_name: $('#cus_name').val(),
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            confirm_password: $('#confirm-password').val(),
            role: $('#role').val()
        };

        // Kiểm tra các trường không được để trống
        for (const field in formData) {
            console.log(`${field}: ${formData[field]}`);  // In giá trị của từng trường
        }

        // Gửi AJAX request nếu tất cả trường hợp không null
        $.ajax({
            url: '/Admin/AddAccount',
            type: 'POST',
            data: formData,
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: response.message,
                        confirmButtonText: 'Đồng ý'
                    }).then(() => {
                        $('#add-account-form')[0].reset();
                        $('#account-table').DataTable().ajax.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: response.message,
                        confirmButtonText: 'Đóng'
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi hệ thống!',
                    text: 'Đã xảy ra lỗi, vui lòng thử lại.',
                    confirmButtonText: 'Đóng'
                });
            }
        });
    });

    // Xử lý sự kiện xóa tài khoản
    $('#account-table').on('click', '.delete-account', function () {
        $('.overlay').addClass('active') ;
        const userId = $(this).data('id');  // Lấy UserId từ thuộc tính data-id

        // Xác nhận xóa tài khoản
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa tài khoản?',
            text: "Bạn sẽ không thể khôi phục lại tài khoản này.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi yêu cầu Ajax để xóa tài khoản
                $.ajax({
                    url: '/Admin/DeleteAccount',  // URL API xóa tài khoản
                    type: 'POST',
                    data: { userId: userId },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công!',
                                text: response.message,
                                confirmButtonText: 'Đồng ý'
                            }).then(() => {
                                // Reload DataTable để cập nhật dữ liệu
                                $('#account-table').DataTable().ajax.reload();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi!',
                                text: response.message,
                                confirmButtonText: 'Đóng'
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi hệ thống!',
                            text: 'Đã xảy ra lỗi khi xóa tài khoản.',
                            confirmButtonText: 'Đóng'
                        });
                    }
                });
            }
        });
    });

    $(document).on('click', '.view-details', function () {
        var userId = parseInt($(this).data('id'), 10);  // Lấy UserId từ nút "Xem chi tiết"
        $('.overlay').addClass('active');

        // Lấy thông tin tài khoản từ server (bạn có thể thay bằng một API thực tế)
        $.ajax({
            url: '/Admin/GetAccountById', // Thay bằng URL API lấy thông tin chi tiết tài khoản
            type: 'GET',
            data: { userId: userId },
            success: function (response) {
                // Nếu thành công, điền dữ liệu vào các ô input trong modal
                $('#edit-id').val(response.UserId);
                $('#edit-cusname').val(response.CusName);
                $('#edit-email').val(response.Email);
                $('#edit-phone').val(response.Phone);
                $('#edit-address').val(response.Address);
                $('#edit-role').val();
                $('#edit-created-at').val(formatDateFromAspNet(response.CreatedAt));

                // Hiển thị modal
                $('#account-detail-modal').show();
                $('.overlay').show();
            },
            error: function () {
                alert('Không thể lấy thông tin tài khoản');
            }
        });
    });

    // Khi click vào nút "Đóng"
    $('#close-detail-btn').click(function () {
        $('#account-detail-modal').hide();
        $('.overlay').hide();
    });

    // Khi click vào nút "Lưu thay đổi"
    $('#save-account-btn').click(function () {
        var updatedData = {
            id: $('#edit-id').val(),
            cus_name: $('#edit-cusname').val(),
            email: $('#edit-email').val(),
            phone: $('#edit-phone').val(),
            address: $('#edit-address').val(),
            role: $('#edit-role').val(),
            created_at: $('#edit-created-at').val()
        };

        // Gửi dữ liệu đã chỉnh sửa lên server (thay URL API theo thực tế)
        $.ajax({
            url: '/Admin/UpdateAccount', // Thay bằng URL API cập nhật tài khoản
            type: 'POST',
            data: updatedData,
            success: function (response) {
                // Đầu tiên ẩn modal và overlay
                $('#account-detail-modal').hide();
                $('.overlay').hide();

                // Sau khi ẩn modal, hiển thị thông báo từ server bằng SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật tài khoản thành công!',
                    text: response.message, // Thông điệp từ controller
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Làm mới bảng sau khi thông báo
                        $('#account-table').DataTable().ajax.reload();
                    }
                });
            },
            error: function () {
                // Hiển thị thông báo lỗi
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật thất bại!',
                    text: 'Đã xảy ra lỗi khi cập nhật tài khoản.',
                    confirmButtonText: 'OK'
                });
            }
        });
    });

});

function formatDateFromAspNet(dateString) {
    // Lấy số timestamp từ chuỗi "/Date(1736930967890)/"
    const timestamp = parseInt(dateString.match(/\d+/)[0]);

    // Tạo đối tượng Date từ timestamp
    const date = new Date(timestamp);

    // Định dạng ngày/tháng/năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}



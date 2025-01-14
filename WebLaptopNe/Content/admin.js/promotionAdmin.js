﻿$(document).ready(function () {
    // Khởi tạo DataTable
    const table = $('#promotion-table').DataTable({
        ajax: {
            url: '/Admin/GetPromotions', // URL API
            type: "GET", // Phương thức HTTP
            dataSrc: '', // DataTables tự hiểu JSON không cần root
        },
        destroy: true,
        autoWidth: false,
        paging: true, // Bật phân trang
        pageLength: 10, // Số mục trên mỗi trang
        columns: [
            { data: 'PromotionId' },
            { data: 'PromotionName' },
            {
                data: 'StartDate',
                render: function (data) {
                    const timestamp = parseInt(data.match(/\d+/)[0]);
                    const date = new Date(timestamp);

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                }
            },
            {
                data: 'EndDate',
                render: function (data) {
                    const timestamp = parseInt(data.match(/\d+/)[0]);
                    const date = new Date(timestamp);

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                }
            },
            { data: 'DiscountPercent' },
            { data: 'PromotionType' },
            {
                data: null,
                render: function (data, type, row) {
                    return `<button class="view-details" data-id="${row.PromotionId}">DSSP</button>
                    <button class="edit-promotion" data-id="${row.PromotionId}">Chỉnh sửa</button>
                    `;
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="delete-promotion" data-id="${row.PromotionId}">Xóa</button>`;
                }
            }
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

    $('#promotion-form').on('submit', function (e) {
        e.preventDefault(); // Ngăn form reload mặc định

        // Thu thập dữ liệu từ form
        const formData = {
            promotion_name: $('#promotion_name').val(),
            end_day: $('#end_day').val(),
            discount_percent: $('#discount_percent').val(),
            promotion_type: $('#promotion_type').val(),
        };

        console.log('Dữ liệu gửi đi:', formData); // Log dữ liệu để kiểm tra

        // Gửi dữ liệu bằng AJAX
        $.ajax({
            url: '/Admin/AddPromotion', // Đường dẫn tới controller xử lý
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(formData), // Chuyển formData thành JSON
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: response.message,
                        confirmButtonText: 'OK',
                    }).then(() => {
                        location.reload(); // Reload lại trang sau khi thêm thành công
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: response.message,
                        confirmButtonText: 'OK',
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi gửi dữ liệu.',
                    confirmButtonText: 'OK',
                });
            }
        });
    });


    $('#product-to-promotion-form').on('submit', function (e) {
        e.preventDefault();

        // Lấy giá trị từ form
        const promotionId = $('#promotion-select').val();
        const productId = $('#product-id').val();

        // Kiểm tra các giá trị
        if (!promotionId || !productId) {
            Swal.fire({
                icon: 'warning',
                title: 'Thông báo',
                text: 'Vui lòng chọn chương trình và nhập ID sản phẩm.',
            });
            return;
        }

        // Gửi Ajax request
        $.ajax({
            url: '/Admin/AddProductToPromotion',
            type: 'POST',
            data: { promotionId: promotionId, productId: productId },
            success: function (response) {
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: response.message,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: response.message,
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.',
                });
            },
        });
    });

    $(document).on('click', '.view-details', function () {
        const promotionId = $(this).data('id'); // Lấy ID chương trình khuyến mãi từ data-id

        // Gửi yêu cầu GET tới API để lấy danh sách sản phẩm
        $.ajax({
            url: '/Admin/GetProductsByPromotion', // API trả về danh sách sản phẩm
            type: 'GET',
            data: { promotionId: promotionId },
            success: function (response) {
                if (response.success) {
                    // Nếu thành công, hiển thị danh sách sản phẩm
                    let productTable = `
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID Sản Phẩm</th>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Giá</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    response.data.forEach(product => {
                        productTable += `
                            <tr>
                                <td>${product.ProductId}</td>
                                <td>${product.ProductName}</td>
                                <td>${product.UnitPrice.toLocaleString()} VND</td>
                                <td>
                                    <button class="btn btn-danger delete-product-inpromotion" data-id="${product.ProductId}" data-promotion-id="${promotionId}">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        `;
                    });

                    productTable += `
                            </tbody>
                        </table>
                    `;

                    // Hiển thị danh sách sản phẩm trong SweetAlert modal
                    Swal.fire({
                        title: 'Danh Sách Sản Phẩm',
                        html: productTable, // Hiển thị bảng sản phẩm
                        showCloseButton: true,
                        width: '800px'
                    });
                } else {
                    // Nếu không có sản phẩm nào
                    Swal.fire({
                        icon: 'info',
                        title: 'Thông báo',
                        text: response.message,
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể tải danh sách sản phẩm.',
                });
            }
        });
    });

     //Sự kiện khi nhấn vào nút "Xóa" sản phẩm
    $(document).on('click', '.delete-product-inpromotion', function () {
        const productId = $(this).data('id');
        const promotionId = $(this).data('promotion-id');

        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Sản phẩm này sẽ bị xóa khỏi chương trình!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi yêu cầu xóa sản phẩm
                $.ajax({
                    url: '/Admin/RemoveProductFromPromotion',
                    type: 'POST',
                    data: { promotionId: promotionId, productId: productId },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công',
                                text: response.message,
                            }).then(() => {
                                // Reload lại danh sách sản phẩm
                                $(`.view-details[data-id="${promotionId}"]`).click();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: response.message,
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể xóa sản phẩm.',
                        });
                    }
                });
            }
        });
    });

    $(document).on('click', '.delete-promotion', function () {
        const promotionId = $(this).data('id'); // Lấy ID chương trình khuyến mãi từ thuộc tính data-id

        // Hiển thị hộp thoại xác nhận trước khi xóa
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Chương trình này sẽ bị xóa vĩnh viễn!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi yêu cầu xóa chương trình khuyến mãi
                $.ajax({
                    url: '/Admin/RemovePromotion', // URL API xử lý xóa chương trình
                    type: 'POST',
                    data: { promotionId: promotionId },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công',
                                text: response.message,
                            }).then(() => {
                                // Reload lại DataTable để cập nhật danh sách sau khi xóa
                                $('#promotion-table').DataTable().ajax.reload();
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: response.message,
                            });
                        }
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Không thể xóa chương trình khuyến mãi.',
                        });
                    }
                });
            }
        });
    });

    $(document).on('click', '.edit-promotion', function () {
        const promotionId = $(this).data('id');

        // Gửi yêu cầu GET để lấy thông tin chi tiết của chương trình khuyến mãi
        $.ajax({
            url: '/Admin/GetPromotionById', // API lấy thông tin chương trình
            type: 'GET',
            data: { promotionId: promotionId }, // Truyền promotionId dưới dạng query string
            success: function (response) {
                if (response.success) {
                    const promotion = response.data;
                    const parseDate = (dateString) => {
                        // Kiểm tra nếu dateString là định dạng .NET (e.g., /Date(1673452800000)/)
                        const match = /\/Date\((\d+)\)\//.exec(dateString);
                        if (match) {
                            // Chuyển đổi timestamp thành ISO string
                            return new Date(parseInt(match[1])).toISOString().split('T')[0];
                        } else {
                            // Trường hợp dateString là định dạng hợp lệ
                            return new Date(dateString).toISOString().split('T')[0];
                        }
                    };

                    // Hiển thị SweetAlert với form chỉnh sửa
                    Swal.fire({
                        title: 'Chỉnh sửa chương trình',
                        html: `
                            <form id="edit-promotion-form">
                                <div class="form-group">
                                    <label for="edit-promotion-name">Tên chương trình:</label>
                                    <input type="text" id="edit-promotion-name" value="${promotion.PromotionName}" class="swal2-input">
                                </div>
                                <div class="form-group">
                                    <label for="edit-start-date">Ngày bắt đầu:</label>
                                    <input type="date" id="edit-start-date" value="${parseDate(promotion.StartDate)}" class="swal2-input" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="edit-end-date">Ngày kết thúc:</label>
                                    <input type="date" id="edit-end-date" value="${parseDate(promotion.EndDate)}" class="swal2-input">
                                </div>
                                <div class="form-group">
                                    <label for="edit-discount-percent">Mức giảm giá (%):</label>
                                    <input type="number" id="edit-discount-percent" value="${promotion.DiscountPercent}" class="swal2-input" min="1" max="100">
                                </div>
                                <div class="form-group">
                                    <label for="edit-promotion-type">Loại chương trình:</label>
                                    <select id="edit-promotion-type" class="swal2-input">
                                        <option value="gift" ${promotion.PromotionType === 'gift' ? 'selected' : ''}>Quà Tặng</option>
                                        <option value="discount" ${promotion.PromotionType === 'discount' ? 'selected' : ''}>Giảm Giá</option>
                                    </select>
                                </div>
                            </form>
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Lưu',
                        cancelButtonText: 'Hủy',
                        preConfirm: () => {
                            // Lấy dữ liệu từ form
                            return {
                                id: promotionId,
                                promotion_name: $('#edit-promotion-name').val(),
                                start_day: $('#edit-start-date').val(),
                                end_day: $('#edit-end-date').val(),
                                discount_percent: $('#edit-discount-percent').val(),
                                promotion_type: $('#edit-promotion-type').val(),
                            };
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Gửi dữ liệu chỉnh sửa tới server
                            console.log(result.value)
                            $.ajax({
                                url: '/Admin/UpdatePromotion', // API cập nhật chương trình
                                type: 'POST',
                                data: result.value,
                                
                                success: function (response) {
                                    if (response.success) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Thành công',
                                            text: response.message,
                                        }).then(() => {
                                            // Reload lại DataTable để cập nhật danh sách
                                            $('#promotion-table').DataTable().ajax.reload();
                                        });
                                    } else {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Lỗi',
                                            text: response.message,
                                        });
                                    }
                                },
                                error: function () {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Lỗi',
                                        text: 'Không thể cập nhật chương trình.',
                                    });
                                }
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: response.message,
                    });
                }
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể tải thông tin chương trình.',
                });
            }
        });
    });
});



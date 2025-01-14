$(document).ready(function () {
    // Khởi tạo DataTable
    const table = $('#order-table').DataTable({
        ajax: {
            url: '/Admin/GetOrders', // URL API
            type: "GET", // Phương thức HTTP
            dataSrc: '', // DataTables tự hiểu JSON không cần root
            data: function (d) {
                d.searchValue = $("#order-search").val(); // Lấy giá trị tìm kiếm từ input
                d.status = $("#sort-select-order").val(); // Lấy giá trị bộ lọc trạng thái
            },
        },
        destroy: true,
        autoWidth: false,
        paging: true, // Bật phân trang
        pageLength: 10, // Số mục trên mỗi trang
        columns: [
            { data: 'OrderId' }, // ID đơn hàng
            { data: 'CustomerName' }, // Tên khách hàng
            {
                data: 'OrderDate',
                render: function (data) {
                    const timestamp = parseInt(data.match(/\d+/)[0]);
                    const date = new Date(timestamp);

                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                }
            },
            { data: 'DeliveryAddress' }, // Địa chỉ giao hàng
            { data: 'OrderStatus' }, // Trạng thái đơn hàng
            {
                data: "TotalPrice", // Tổng tiền
                render: function (data) {
                    return parseInt(data).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    });
                },
            },
            {
                data: null,
                render: function () {
                    return `<button class="view-details">Xem chi tiết</button>`;
                }
            },
            {
                data: null, // Thao tác: Duyệt và Từ chối
                render: function (data, type, row) {
                    if (row.OrderStatus === "Pending") {
                        return `
                            <button class="approve-order" data-index="${row.id}">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button class="reject-order" data-index="${row.id}">
                                <i class="fa-solid fa-times"></i>
                            </button>`;
                    } else {
                        return null;
                    }
                },
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

    // Nút tìm kiếm
    $("#search-btn-order").on("click", function () {
        table.ajax.reload(); // Reload dữ liệu khi tìm kiếm
    });

    // Bộ lọc đơn hàng
    $("#sort-btn-order").on("click", function () {
        table.ajax.reload(); // Reload dữ liệu khi áp dụng bộ lọc
    });


    $("#order-table").on("click", ".view-details", function () {
        const rowData = $('#order-table').DataTable().row($(this).parents('tr')).data();
        // Lấy chi tiết hóa đơn từ API
        $.ajax({
            url: `/Admin/GetOrderDetails?orderId=${rowData.OrderId}`, // API lấy thông tin hóa đơn
            type: "GET",
            success: function (data) {
                console.log(data); 
                // Điền thông tin vào overlay
                $("#customer-name").text(data.CustomerName);
                $("#customer-address").text(data.DeliveryAddress);
                $("#customer-phone").text(data.Phone);
                const formattedDate = formatDateFromAspNet(data.CreatedAt);
                $("#createdAtDate").text(formattedDate);

                // Điền thông tin sản phẩm vào bảng
                const orderItemsBody = $("#order-items-body");
                orderItemsBody.empty(); // Xóa nội dung cũ
                data.Items.forEach(item => {
                    orderItemsBody.append(`
                        <tr>
                            <td>${item.ProductId}</td>
                            <td>${item.ProductName}</td>
                            <td>${item.Quantity}</td>
                            <td>${parseInt(item.UnitPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                            <td>${parseInt(item.Amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                        </tr>
                    `);
                });

                // Cập nhật tổng tiền
                $("#total-amount").text(
                    parseInt(data.TotalAmount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                );

                // Hiển thị overlay
                $("#overlay").fadeIn();
            },
            error: function () {
                alert("Không thể lấy thông tin chi tiết đơn hàng!");
            }
        });
        
        $("#overlay").addClass("active");
    });

    // Đóng overlay
    $("#close-invoice-details").on("click", function () {
        $("#overlay").removeClass("active");
    });

    // Sự kiện click "Xác nhận đơn hàng"
    $("#order-table").on("click", ".approve-order", function () {
        const rowData = $('#order-table').DataTable().row($(this).parents('tr')).data();

        // Hiển thị SweetAlert để xác nhận
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn muốn xác nhận đơn hàng này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi yêu cầu xác nhận đơn hàng
                $.ajax({
                    url: `/Admin/ApproveOrder`, // URL API xác nhận đơn hàng
                    type: "POST",
                    data: { orderId: rowData.OrderId },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Thành công!',
                                response.message,
                                'success'
                            );
                            $('#order-table').DataTable().ajax.reload(); // Reload bảng dữ liệu
                        } else {
                            Swal.fire(
                                'Thất bại!',
                                response.message,
                                'error'
                            );
                        }
                    },
                    error: function () {
                        Swal.fire(
                            'Lỗi!',
                            'Không thể xác nhận đơn hàng.',
                            'error'
                        );
                    }
                });
            }
        });
    });


    // Sự kiện click "Từ chối đơn hàng"
    $("#order-table").on("click", ".reject-order", function () {
        const rowData = $('#order-table').DataTable().row($(this).parents('tr')).data();

        // Hiển thị SweetAlert để xác nhận
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn muốn từ chối đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Hủy bỏ',
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi yêu cầu từ chối đơn hàng
                $.ajax({
                    url: `/Admin/RejectOrder`, // URL API từ chối đơn hàng
                    type: "POST",
                    data: { orderId: rowData.OrderId },
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Thành công!',
                                response.message,
                                'success'
                            );
                            $('#order-table').DataTable().ajax.reload(); // Reload bảng dữ liệu
                        } else {
                            Swal.fire(
                                'Thất bại!',
                                response.message,
                                'error'
                            );
                        }
                    },
                    error: function () {
                        Swal.fire(
                            'Lỗi!',
                            'Không thể từ chối đơn hàng.',
                            'error'
                        );
                    }
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

$(document).ready(function () {
    // Gửi yêu cầu đến API để lấy dữ liệu
    $.ajax({
        url: '/Admin/GetOrderStats',  // API URL
        type: 'GET',
        success: function (data) {
            // Hiển thị dữ liệu lên giao diện
            $('#total-orders').text(data.TotalOrders);  // Tổng đơn hàng
            $('#pending-orders').text(data.PendingOrders);  // Đơn hàng chưa xử lý
            $('#in-transit-orders').text(data.InTransitOrders);  // Đơn hàng đang giao
        },
        error: function () {
            console.error('Không thể lấy dữ liệu thống kê đơn hàng.');
        }
    });
});


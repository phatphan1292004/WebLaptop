
$(document).ready(function () {
    const customerTable = $('#customerTable').DataTable({
        ajax: {
            url: '/Admin/GetCustomerList', // API URL
            type: 'GET', // Phương thức HTTP
            dataSrc: '', // DataTables tự hiểu JSON
        },
        destroy: true, // Cho phép tái tạo DataTable nếu đã tồn tại
        autoWidth: false, // Tắt tự động chiều rộng cột
        paging: true, // Bật phân trang
        pageLength: 10, // Số mục trên mỗi trang
        lengthChange: false, // Tắt tùy chọn "Show Entries"
        searching: true, // Tắt ô tìm kiếm mặc định
        ordering: true, // Cho phép sắp xếp
        info: true, // Hiển thị thông tin phân trang
        columns: [
            { data: 'id' }, // ID khách hàng
            { data: 'cus_name' }, // Tên khách hàng
            { data: 'email' }, // Email
            { data: 'phone' }, // Số điện thoại
            { data: 'address' }, // Địa chỉ
            { data: 'CreatedAt' }, // Ngày đăng ký
            {
                data: null, // Nút "Xem chi tiết"
                render: function (data, type, row) {
                    return `
                        <button class="view-details" data-id="${row.id}" onclick="viewPurchaseHistory(${row.id})">
                            Xem chi tiết
                        </button>`;
                }
            }
        ],
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
});

$(document).ready(function () {
    // Gửi yêu cầu đến API để lấy dữ liệu thống kê
    $.ajax({
        url: '/Admin/GetCustomerStats', // Đường dẫn đến API
        type: 'GET',
        success: function (data) {
            // Cập nhật các giá trị vào UI
            $('#monthly-total-customers').text(data.MonthlyTotalCustomers ? data.MonthlyTotalCustomers : 0); // Tổng khách hàng trong tháng
            $('#new-customers-today').text(data.NewCustomersToday); // Khách hàng mới hôm nay
            $('#regular-customers').text(data.RegularCustomers + "/5"); // Khách hàng thường xuyên (>= 5 đơn hàng)
            $('#customer-feedback-count').text(data.CustomerFeedbackCount + " đánh giá"); // Phản hồi từ khách hàng
        },
        error: function () {
            console.error('Không thể lấy dữ liệu thống kê.');
        }
    });
});



    // Hàm xử lý khi nhấn nút Xem chi tiết
function viewPurchaseHistory(customerId) {
    $.ajax({
        url: `/Admin/GetPurchaseHistory?customerId=${customerId}`,
        type: 'GET',
        success: function (data) {
            if (data && data.length > 0) {
                // Tạo bảng với CSS đẹp
                let purchaseHistoryHtml = `
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: Arial, sans-serif;">
                        <thead>
                            <tr style="background-color: #f2f2f2; border-bottom: 1px solid #ddd;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Đơn hàng ID</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Ngày đặt</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Tổng tiền</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.forEach(item => {
                    purchaseHistoryHtml += `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">${item.id}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #27ae60; font-weight: bold;">
                                ${item.total_price.toLocaleString('vi-VN')} VND
                            </td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #2980b9;">${item.order_status}</td>
                        </tr>
                    `;
                });

                purchaseHistoryHtml += `
                        </tbody>
                    </table>
                `;

                Swal.fire({
                    title: `Lịch sử mua hàng của khách hàng #${customerId}`,
                    html: `<div style="padding: 20px;">${purchaseHistoryHtml}</div>`,
                    confirmButtonText: 'Đóng',
                    width: '700px', // Tùy chỉnh chiều rộng modal
                    padding: '10px',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'custom-confirm-btn' // Class riêng cho nút
                    }
                });
            } else {
                Swal.fire({
                    title: `Lịch sử mua hàng`,
                    text: `Khách hàng #${customerId} chưa có đơn hàng nào.`,
                    icon: 'warning',
                    confirmButtonText: 'Đóng',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'custom-confirm-btn' // Class riêng cho nút
                    }
                });
            }
        },
        error: function () {
            Swal.fire({
                title: 'Lỗi',
                text: 'Không thể lấy lịch sử mua hàng.',
                icon: 'error',
                confirmButtonText: 'Đóng',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'custom-confirm-btn' // Class riêng cho nút
                }
            });
        }
    });
}




// Hàm hiển thị nội dung tab theo section
function showContent(sectionId) {
    // Ẩn tất cả các tab nội dung
    const contentSections = document.querySelectorAll(".content_section");
    contentSections.forEach((section) => {
        section.style.display = "none";
    });

    // Hiển thị tab được chọn
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";
    }

    // Loại bỏ class "active" khỏi tất cả các menu
    const menuItems = document.querySelectorAll(".menu-user li");
    menuItems.forEach((item) => {
        item.classList.remove("active");
    });

    // Thêm class "active" vào mục menu được chọn
    const activeMenuItem = document.querySelector(
        `.menu-user li[data-section="${sectionId}"]`
    );
    if (activeMenuItem) {
        activeMenuItem.classList.add("active");
    }
}

// Gán sự kiện click cho từng mục menu
document.querySelectorAll(".menu-user li").forEach((menuItem) => {
    menuItem.addEventListener("click", function () {
        const sectionId = this.getAttribute("data-section");
        if (sectionId) {
            showContent(sectionId);
        }
    });
});

// Hiển thị mặc định tab đầu tiên khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    const defaultTab = document.querySelector(".menu-user li.active");
    if (defaultTab) {
        const defaultSection = defaultTab.getAttribute("data-section");
        if (defaultSection) {
            showContent(defaultSection);
        }
    }
});


$(document).ready(function () {
    // Xử lý khi người dùng gửi form đổi mật khẩu
    $('.change_password_form').submit(function (event) {
        event.preventDefault(); // Ngừng hành động mặc định của form

        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirm_password').val();

        // Kiểm tra các trường hợp trống
        if (!oldPassword || !newPassword || !confirmPassword) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Vui lòng điền đầy đủ thông tin.',
                icon: 'warning',
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // Gửi yêu cầu POST tới server để thay đổi mật khẩu
        $.ajax({
            url: '/Login/ChangePassword',
            type: 'POST',
            data: {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            },
            success: function (response) {
                // Kiểm tra nếu có thông báo lỗi hoặc thành công từ server
                if (response.errorMessage) {
                    Swal.fire({
                        title: 'Lỗi',
                        text: response.errorMessage,
                        icon: 'error',
                        confirmButtonText: 'Đóng',
                        confirmButtonColor: '#d33',
                    });
                } else if (response.successMessage) {
                    Swal.fire({
                        title: 'Thành công',
                        text: response.successMessage,
                        icon: 'success',
                        confirmButtonText: 'Đóng',
                        confirmButtonColor: '#28a745',
                    });
                }
            },
            error: function () {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#d33',
                });
            }
        });
    });

    function loadOrderHistory() {
        $.ajax({
            url: '/Home/GetOrderHistory', // Gọi API lấy lịch sử đơn hàng
            type: 'GET',
            success: function (data) {
                if (data && data.length > 0) {
                    let orderTableBody = $('#orderTableBody');
                    orderTableBody.empty(); // Xóa dữ liệu cũ

                    // Lặp qua danh sách đơn hàng và thêm vào bảng
                    data.forEach(function (order) {
                        // Chuyển đổi chuỗi /Date(1736594242870)/ thành Date
                        let orderDate = new Date(parseInt(order.created_at.replace("/Date(", "").replace(")/", "")));

                        const orderRow = `
                            <tr>
                                <td>${order.id}</td>
                                <td>${orderDate.toLocaleDateString()}</td> <!-- Hiển thị ngày -->
                                <td>${order.total_price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                                <td>${order.order_status}</td>
                            </tr>
                        `;
                        orderTableBody.append(orderRow);
                    });
                } else {
                    Swal.fire({
                        title: 'Thông báo',
                        text: 'Bạn chưa có đơn hàng nào.',
                        icon: 'warning',
                        confirmButtonText: 'Đóng',
                    });
                }
            },
            error: function () {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Không thể lấy dữ liệu đơn hàng.',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                });
            }
        });
    }

    // Gọi hàm tải lịch sử đơn hàng khi trang load
    loadOrderHistory();
});



document.addEventListener("DOMContentLoaded", async function () {
    const fetchData = async (url) => {
        const response = await fetch(url);
        return response.json();
    };

    // Lấy danh sách tỉnh/thành phố
    const provinces = await fetchData("https://provinces.open-api.vn/api/p/");
    const provinceSelect = document.getElementById("province");

    // Hiển thị tên tỉnh/thành phố trong value
    provinces.forEach((province) => {
        const option = new Option(province.name, province.name); // Sử dụng name thay vì code
        provinceSelect.appendChild(option);
    });

    // Khi chọn tỉnh/thành phố, lấy danh sách quận/huyện
    provinceSelect.addEventListener("change", async function () {
        const provinceName = this.value; // Lấy tên của tỉnh/thành phố
        const districtSelect = document.getElementById("district");
        const wardSelect = document.getElementById("ward");

        districtSelect.innerHTML = '<option value="">Chọn Quận, Huyện</option>';
        wardSelect.innerHTML = '<option value="">Chọn Phường, Xã</option>';

        // Tìm mã tỉnh/thành phố từ tên
        const selectedProvince = provinces.find(
            (province) => province.name === provinceName
        );

        if (selectedProvince) {
            const province = await fetchData(
                `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
            );

            province.districts.forEach((district) => {
                const option = new Option(district.name, district.name); // Sử dụng name thay vì code
                districtSelect.appendChild(option);
            });
        }
    });

    // Khi chọn quận/huyện, lấy danh sách phường/xã
    document
        .getElementById("district")
        .addEventListener("change", async function () {
            const districtName = this.value; // Lấy tên của quận/huyện
            const wardSelect = document.getElementById("ward");
            wardSelect.innerHTML = '<option value="">Chọn Phường, Xã</option>';

            // Tìm mã quận/huyện từ tên
            const provinceName = provinceSelect.value;
            const selectedProvince = provinces.find(
                (province) => province.name === provinceName
            );

            if (selectedProvince) {
                const province = await fetchData(
                    `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
                );

                const selectedDistrict = province.districts.find(
                    (district) => district.name === districtName
                );

                if (selectedDistrict) {
                    const district = await fetchData(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
                    );

                    district.wards.forEach((ward) => {
                        const option = new Option(ward.name, ward.name); // Sử dụng name thay vì code
                        wardSelect.appendChild(option);
                    });
                }
            }
        });
 


  // Hàm kiểm tra input có hợp lệ hay không
  const validateInput = (input) => {
    if (!input.validity.valid || !input.value) {
      input.classList.add("invalid");
      input.classList.remove("valid");
    } else {
      input.classList.add("valid");
      input.classList.remove("invalid");
    }
  };

  document
    .querySelectorAll("input[required], select[required]")
    .forEach((input) => {
      input.addEventListener("input", () => validateInput(input));
      input.addEventListener("change", () => validateInput(input));
    });
   
    
    $(document).ready(function () {
        // Giảm số lượng
        $(".quantity-btn.decrease").click(function () {
            const productId = $(this).data("product-id");
            const input = $(this).siblings(".quantity-input");
            let quantity = parseInt(input.val());

            if (quantity > 1) {
                quantity -= 1;
                updateQuantity(productId, quantity, input);
            }
        });

        // Tăng số lượng
        $(".quantity-btn.increase").click(function () {
            const productId = $(this).data("product-id");
            const input = $(this).siblings(".quantity-input");
            let quantity = parseInt(input.val());

            quantity += 1;
            updateQuantity(productId, quantity, input);
        });

        // Cập nhật số lượng khi người dùng nhập thủ công
        $(".quantity-input").change(function () {
            const productId = $(this).data("product-id");
            let quantity = parseInt($(this).val());

            if (quantity > 0) {
                updateQuantity(productId, quantity, $(this));
            } else {
                alert("Số lượng không hợp lệ!");
                $(this).val(1);
            }
        });

        // Hàm gửi yêu cầu AJAX để cập nhật số lượng
        function updateQuantity(productId, quantity, input) {
            $.ajax({
                url: "/Cart/UpdateQuantity",
                type: "POST",
                data: { productId: productId, quantity: quantity },
                success: function (response) {
                    if (response.success) {
                        input.val(quantity); // Cập nhật giá trị input
                        $(".total-price").text(response.totalPrice + " VND"); // Cập nhật tổng tiền
                    } else {
                        alert(response.message);
                    }
                },
                error: function () {
                    alert("Đã xảy ra lỗi khi cập nhật số lượng.");
                }
            });
        }

        $(".delete-item").click(function () {
            const productId = $(this).data("product-id"); // Lấy ID sản phẩm từ thuộc tính data
            const productItem = $(this).closest(".product-item"); // Lấy phần tử sản phẩm hiện tại

            // Hiển thị hộp thoại xác nhận
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
                // Nếu người dùng nhấn OK
                $.ajax({
                    url: "/Cart/RemoveFromCart", // Đường dẫn đến Action RemoveFromCart
                    type: "POST",
                    data: { productId: productId },
                    success: function (response) {
                        if (response.success) {
                            productItem.remove(); // Xóa sản phẩm khỏi giao diện
                            $(".total-price").text(response.totalPrice + " VND"); // Cập nhật tổng tiền
                            alert(response.message); // Thông báo thành công
                        } else {
                            alert(response.message); // Hiển thị thông báo lỗi
                        }
                    },
                    error: function () {
                        alert("Đã xảy ra lỗi khi xóa sản phẩm."); // Thông báo lỗi khi AJAX thất bại
                    }
                });
            }
            // Nếu người dùng nhấn Cancel, không thực hiện hành động gì
        });

        // Đặt tab đầu tiên là active khi load trang
        $(".tab-content").first().addClass("active");
        $(".nav-item").first().addClass("active completed");

        //Chuyển tab khi nhấn nút "ĐẶT HÀNG NGAY"
        //$(".buy-btn").click(function () {
        //    const nextTabId = $(this).data("next-tab");

        //    if (nextTabId) {
        //        // Hiển thị tab tiếp theo
        //        $(".tab-content").removeClass("active");
        //        $(`#${nextTabId}`).addClass("active");

        //        // Đánh dấu tất cả các tab trước đó là active và completed
        //        $(".nav-item").each(function () {
        //            const tabId = $(this).data("tab");
        //            if (tabId && $(`#${tabId}`).index() <= $(`#${nextTabId}`).index()) {
        //                $(this).addClass("active completed");
        //            }
        //        });

        //        // Cập nhật URL hash
        //        const newUrl = `${window.location.origin}${window.location.pathname}#${nextTabId}`;
        //        history.pushState({ tab: nextTabId }, null, newUrl);
        //    }
        //});

        // Chuyển tab khi nhấn vào menu
        //$(".nav-item").click(function () {
        //    const tabId = $(this).data("tab");

        //    if (tabId) {
        //        // Hiển thị tab được chọn
        //        $(".tab-content").removeClass("active");
        //        $(`#${tabId}`).addClass("active");

        //        // Đánh dấu tất cả các tab trước đó là active và completed
        //        $(".nav-item").each(function () {
        //            const currentTabId = $(this).data("tab");
        //            if (currentTabId && $(`#${currentTabId}`).index() <= $(`#${tabId}`).index()) {
        //                $(this).addClass("active completed");
        //            } else {
        //                $(this).removeClass("active");
        //            }
        //        });

        //        // Cập nhật URL hash
        //        const newUrl = `${window.location.origin}${window.location.pathname}#${tabId}`;
        //        history.pushState({ tab: tabId }, null, newUrl);
        //    }
        //});

        // Kiểm tra URL khi tải lại trang
        function loadTabFromHash() {
            const currentHash = window.location.hash.substring(1); // Lấy ID từ hash
            if (currentHash) {
                $(".tab-content").removeClass("active");
                $(`#${currentHash}`).addClass("active");

                $(".nav-item").each(function () {
                    const tabId = $(this).data("tab");
                    if (tabId && $(`#${tabId}`).index() <= $(`#${currentHash}`).index()) {
                        $(this).addClass("active completed");
                    } else {
                        $(this).removeClass("active");
                    }
                });
            }
        }

        // Gọi loadTabFromHash khi tải trang
        loadTabFromHash();

        // Lắng nghe sự kiện "popstate" khi người dùng nhấn nút quay lại hoặc tiến tới
        window.addEventListener("popstate", function (event) {
            if (event.state && event.state.tab) {
                const tabId = event.state.tab;

                // Hiển thị tab tương ứng
                $(".tab-content").removeClass("active");
                $(`#${tabId}`).addClass("active");

                // Đánh dấu các tab trước đó là active và completed
                $(".nav-item").each(function () {
                    const currentTabId = $(this).data("tab");
                    if (currentTabId && $(`#${currentTabId}`).index() <= $(`#${tabId}`).index()) {
                        $(this).addClass("active completed");
                    } else {
                        $(this).removeClass("active");
                    }
                });
            } else {
                loadTabFromHash();
            }
        });

        function checkCartAndShowAlert() {
            const hasProducts = $(".list-product .product-item").length > 0; // Kiểm tra xem có sản phẩm nào không

            $(".buy-btn[data-next-tab='order-info']").click(function (e) {
                if (!hasProducts) {
                    e.preventDefault(); // Ngăn hành động mặc định
                    Swal.fire({
                        icon: 'error',
                        title: 'Giỏ hàng trống!',
                        text: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiếp tục.',
                        confirmButtonText: 'OK',
                    });
                }
            });
        }

        // Gọi hàm kiểm tra khi trang được tải
        checkCartAndShowAlert();
    });

    $(document).on("click", ".buy-btn[data-next-tab='payment']", function () {
        const customerInfo = {
            name: $("#cus-name").val(),
            phoneNumber: $("#cus-tele").val(),
            address: `${$("#number-address").val()}, ${$("#ward").val()}, ${$("#district").val()}, ${$("#province").val()}`,
            note: $("#note").val()
        };

        $.ajax({
            url: "/Cart/SaveCustomerInfo",
            type: "POST",
            data: customerInfo,
            success: function (response) {
                if (response.success) {
                    // Chuyển sang tab Thanh toán
                    $(".tab-content").removeClass("active");
                    $("#payment").addClass("active");

                    $(".nav-item").removeClass("active");
                    $(".nav-item[data-tab='payment']").addClass("active");

                    // Hiển thị thông tin khách hàng trong tab Thanh toán
                    loadPaymentInfo();
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Đã xảy ra lỗi khi lưu thông tin khách hàng.");
            }
        });
    });

    function loadPaymentInfo() {
        $.ajax({
            url: "/Cart/GetPaymentInfo",
            type: "GET",
            success: function (response) {
                if (response.success) {
                    const data = response.data;
                    $(".customer-name").text(data.Name);
                    $(".customer-phone").text(data.PhoneNumber);
                    $(".customer-address").text(data.Address);
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Đã xảy ra lỗi khi lấy thông tin thanh toán.");
            }
        });
    }
});

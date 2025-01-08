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

        //Xóa sp khỏi giỏ hàng
        $(".delete-item").click(function () {
            const productId = $(this).data("product-id"); // Lấy ID sản phẩm từ thuộc tính data
            const productItem = $(this).closest(".product-item"); // Lấy phần tử sản phẩm hiện tại

            // Hiển thị hộp thoại xác nhận với SweetAlert2
            Swal.fire({
                title: "Bạn có chắc chắn?",
                text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy",
                buttonsStyling: false,
                customClass: {
                    popup: 'swal-custom-popup', // Áp dụng lớp tùy chỉnh
                    confirmButton: 'swal-custom-confirm-button',
                    icon: 'swal-custom-icon',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Nếu người dùng nhấn "Xóa"
                    $.ajax({
                        url: "/Cart/RemoveFromCart", // Đường dẫn đến Action RemoveFromCart
                        type: "POST",
                        data: { productId: productId },
                        success: function (response) {
                            if (response.success) {
                                // Xóa sản phẩm khỏi giao diện
                                productItem.remove();

                                // Cập nhật tổng tiền
                                $(".total-price").text(response.totalPrice + " VND");

                                // Hiển thị thông báo thành công
                                Swal.fire({
                                    icon: "success",
                                    title: "Đã xóa!",
                                    text: response.message,
                                    timer: 2000,
                                    showConfirmButton: false,
                                    customClass: {
                                        popup: 'swal-custom-popup',
                                        confirmButton: 'swal-custom-confirm-button',
                                        icon: 'swal-custom-icon',
                                    }
                                });
                            } else {
                                // Hiển thị thông báo lỗi
                                Swal.fire({
                                    icon: "error",
                                    title: "Lỗi!",
                                    text: response.message,
                                    timer: 2000,
                                    showConfirmButton: false,
                                    customClass: {
                                        popup: 'swal-custom-popup',
                                        confirmButton: 'swal-custom-confirm-button',
                                        icon: 'swal-custom-icon',
                                    }
                                });
                            }
                        },
                        error: function () {
                            // Thông báo lỗi khi AJAX thất bại
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi!",
                                text: "Đã xảy ra lỗi khi xóa sản phẩm.",
                                timer: 2000,
                                showConfirmButton: false,
                                customClass: {
                                    popup: 'swal-custom-popup',
                                    confirmButton: 'swal-custom-confirm-button',
                                    icon: 'swal-custom-icon',
                                }
                            });
                        },
                    });
                }
            });
        });


        // Đặt tab đầu tiên là active khi load trang
        function setInitialTab() {
            $(".tab-content").first().addClass("active");
            $(".nav-item").first().addClass("active completed");
        }

        // Kích hoạt tab cụ thể
        function activateTab(tabId) {
            $(".tab-content").removeClass("active");
            $(`#${tabId}`).addClass("active");

            $(".nav-item").each(function () {
                const currentTabId = $(this).data("tab");
                $(this).toggleClass("active completed", currentTabId && $(`#${currentTabId}`).index() <= $(`#${tabId}`).index());
            });

            const newUrl = `${window.location.origin}${window.location.pathname}#${tabId}`;
            history.pushState({ tab: tabId }, null, newUrl);
        }

        // Kiểm tra giỏ hàng trống
        function checkCart() {
            const hasProducts = $(".list-product .product-item").length > 0;
            if (!hasProducts) {
                showError("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi tiếp tục.");
                return false;
            }
            return true;
        }

        // Kiểm tra thông tin khách hàng
        function validateCustomerInfo() {
            const name = $("#cus-name").val().trim();
            const phoneNumber = $("#cus-tele").val().trim();
            const province = $("#province").val();
            const district = $("#district").val();
            const ward = $("#ward").val();
            const numberAddress = $("#number-address").val().trim();

            if (!name) return "Vui lòng nhập họ tên.";
            if (!phoneNumber || !/^\d{10,11}$/.test(phoneNumber)) return "Số điện thoại không hợp lệ. Vui lòng nhập từ 10-11 chữ số.";
            if (!province) return "Vui lòng chọn Tỉnh/Thành phố.";
            if (!district) return "Vui lòng chọn Quận/Huyện.";
            if (!ward) return "Vui lòng chọn Phường/Xã.";
            if (!numberAddress) return "Vui lòng nhập Số nhà và Tên đường.";
            return null;
        }

        // Hàm hiển thị lỗi với SweetAlert2
        function showError(message) {
            Swal.fire({
                icon: "error",
                title: "<strong>Thông báo lỗi</strong>",
                html: `<p style="font-size: 16px; color: #333; margin: 10px 0;">${message}</p>`,
                confirmButtonText: "OK",
                buttonsStyling: false, // Tắt CSS mặc định của nút
                customClass: {
                    popup: "swal-custom-popup",
                    confirmButton: "swal-custom-confirm-button",
                    icon: "swal-custom-icon",
                },
            });
        }

        // Lưu thông tin khách hàng
        function saveCustomerInfo(callback) {
            const customerInfo = {
                name: $("#cus-name").val().trim(),
                phoneNumber: $("#cus-tele").val().trim(),
                address: `${$("#number-address").val().trim()}, ${$("#ward").val()}, ${$("#district").val()}, ${$("#province").val()}`,
                note: $("#note").val().trim(),
            };

            $.ajax({
                url: "/Cart/SaveCustomerInfo",
                type: "POST",
                data: customerInfo,
                success: function (response) {
                    if (response.success) {
                        callback && callback();
                    } else {
                        showError(response.message);
                    }
                },
                error: function () {
                    showError("Đã xảy ra lỗi khi lưu thông tin khách hàng.");
                },
            });
        }

        // Hiển thị thông tin thanh toán
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
                        showError(response.message);
                    }
                },
                error: function () {
                    showError("Đã xảy ra lỗi khi lấy thông tin thanh toán.");
                },
            });
        }

        // Xử lý sự kiện "ĐẶT HÀNG NGAY"
        function handleNextTab() {
            $(".buy-btn").click(function () {
                const currentTabId = $(".tab-content.active").attr("id");
                const nextTabId = $(this).data("next-tab");

                if (currentTabId === "cart" && !checkCart()) return;

                if (currentTabId === "order-info") {
                    const validationError = validateCustomerInfo();
                    if (validationError) {
                        showError(validationError);
                        return;
                    }

                    // Lưu thông tin khách hàng trước khi chuyển tab
                    saveCustomerInfo(() => {
                        activateTab(nextTabId);
                        loadPaymentInfo();
                    });
                    return;
                }

                if (currentTabId === "payment") {
                    // Hiển thị loading trong khi tạo đơn hàng
                    Swal.fire({
                        title: "Đang xử lý...",
                        html: '<p style="font-size: 16px; color: #555;">Vui lòng chờ trong giây lát.</p>',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                        customClass: {
                            popup: "swal-custom-popup",
                            title: "swal-custom-title",
                            htmlContainer: "swal-custom-html",
                        },
                    });

                    // Gửi AJAX request để tạo đơn hàng
                    $.ajax({
                        url: "/Cart/CreateOrder", // API để tạo đơn hàng
                        type: "POST",
                        success: function (response) {
                            Swal.close(); // Đóng loading

                            if (response.success) {
                                // Chuyển sang tab thứ 4
                                activateTab(nextTabId);

                                // Hiển thị thông báo thành công
                                Swal.fire({
                                    icon: "success",
                                    title: "🎉 Đặt hàng thành công!",
                                    text: response.message,
                                    timer: 2000,
                                    showConfirmButton: false,
                                    customClass: {
                                        popup: 'swal-custom-popup',
                                        confirmButton: 'swal-custom-confirm-button',
                                        icon: 'swal-custom-icon',
                                    }
                                });
                                
                            } else {
                                // Hiển thị thông báo lỗi
                                Swal.fire({
                                    icon: "error",
                                    title: "Lỗi!",
                                    text: response.message,
                                    timer: 2000,
                                    showConfirmButton: false,
                                    customClass: {
                                        popup: 'swal-custom-popup',
                                        confirmButton: 'swal-custom-confirm-button',
                                        icon: 'swal-custom-icon',
                                    }
                                });
                            }
                        },
                        error: function () {
                            Swal.close(); // Đóng loading
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi",
                                html: `
                                <div style="text-align: center;">
                                    <p style="font-size: 16px; color: #555;">Đã xảy ra lỗi khi đặt hàng.</p>
                                    <p style="font-size: 16px; color: #555;">Vui lòng thử lại sau.</p>
                                </div>`,
                                confirmButtonText: "OK",
                                buttonsStyling: false,
                                customClass: {
                                    popup: "error-popup",
                                    title: "error-title",
                                    htmlContainer: "error-message",
                                    confirmButton: "error-confirm-button",
                                },
                            });
                        },
                    });
                    return;
                }



                // Chuyển tab nếu hợp lệ
                if (nextTabId) activateTab(nextTabId);
            });
        }

        // Chuyển tab khi nhấn vào menu
        function handleNavTabClick() {
            $(".nav-item").click(function () {
                const tabId = $(this).data("tab");

                // Ngăn nhấn vào tab Thanh toán nếu thông tin khách hàng không đầy đủ
                if (tabId === "payment") {
                    const validationError = validateCustomerInfo();
                    if (validationError) {
                        showError(validationError);
                        return;
                    }
                }

                if (tabId) activateTab(tabId);
            });
        }

        // Lấy tab từ URL hash khi tải trang
        function loadTabFromHash() {
            const currentHash = window.location.hash.substring(1);
            if (currentHash) activateTab(currentHash);
        }

        // Lắng nghe sự kiện "popstate"
        function handlePopState() {
            window.addEventListener("popstate", function (event) {
                if (event.state && event.state.tab) {
                    activateTab(event.state.tab);
                } else {
                    loadTabFromHash();
                }
            });
        }

        // Gọi các hàm cần thiết
            setInitialTab();
            handleNextTab();
            handleNavTabClick();
            loadTabFromHash();
            handlePopState();
    });
});

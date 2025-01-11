function formatDateFromTimestamp(timestamp) {
    // Nếu timestamp là dạng "/Date(1736930967890)/", trích xuất số
    const parsedTimestamp = parseInt(timestamp.match(/\d+/)[0]);
    const date = new Date(parsedTimestamp);

    // Định dạng ngày/tháng/năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

$(document).ready(function () {
    // Khởi tạo DataTable
    const table = $('#product-table').DataTable({
        ajax: {
            url: '/Admin/GetProducts', // URL API
            type: "GET", // Phương thức HTTP
            dataSrc: '', // DataTables tự hiểu JSON không cần root
            data: function (d) {
                d.searchValue = $("#product-search").val();
            },
        },
        destroy: true,
        autoWidth: false,
        paging: true, // Bật phân trang
        pageLength: 10, // Số mục trên mỗi trang
        columns: [
            { data: 'id' },
            {
                data: 'ImageUrl',
                render: function (data) {
                    return `<img src="${data}" alt="Image" width="50" height="50">`;
                }
            },
            { data: 'product_name' },
            {
                data: 'unit_price',
                render: function (data) {
                    return `${data.toLocaleString()} VNĐ`;
                }
            },
            { data: 'CategoryName' },
            {
                data: 'created_at',
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
                data: null,
                render: function () {
                    return `<button class="view-details">Xem chi tiết</button>`;
                }
            },
            {
                data: null,
                render: function () {
                    return `
                        <button class="delete-product">Xóa</button>`;
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


    $("#search-btn-product").on("click", function () {
        table.ajax.reload();
    });

    $("#product-table").on("click", ".view-details", function () {
        const rowData = table.row($(this).parents('tr')).data();

        // Gửi yêu cầu tới API lấy thông tin chi tiết sản phẩm
        $.ajax({
            url: `/Admin/GetProductDetails?productId=${rowData.id}`,
            type: "GET",
            success: function (response) {
                console.log(response);
                if (response.success) {
                    const product = response.data;
                    console.log(response.data); 
                    $("#product-image-header").attr("src", product.ImageUrl || "/default-image.jpg"); // Hiển thị hình ảnh sản phẩm
                    $("#product-name-header").text(product.ProductName || "N/A"); // Hiển thị tên sản phẩm
                    $("#product-id-details").text(`#${product.ProductId}` || "N/A"); // Hiển thị mã sản phẩm
                    // Điền dữ liệu vào các field chi tiết sản phẩm
                    $("#product-id-view").text(product.ProductId || "N/A");
                    $("#product-name-view").text(product.ProductName || "N/A");
                    $("#product-image-view").text(product.ImageUrl || "N/A");
                    // Định dạng lại CreatedAt từ timestamp
                    $("#product-date-view").text(
                        product.CreatedAt
                            ? formatDateFromTimestamp(product.CreatedAt)
                            : "N/A"
                    );

                    $("#product-price-view").text(
                        product.UnitPrice
                            ? `${parseInt(product.UnitPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                            : "N/A"
                    );
                    $("#product-status-view").text(product.ProductStatus || "N/A");
                    $("#product-rating-view").text(product.Rating || "N/A");
                    $("#product-discount-view").text(`${product.DiscountPercent}%` || "N/A");
                    $("#product-category-view").text(product.CategoryName || "N/A");
                    $("#product-description-view").text(product.Description || "N/A");
                    $("#product-weight-view").text(`${product.Weight} kg` || "N/A");
                    $("#product-cpu-view").text(product.CPU || "N/A");
                    $("#product-gpu-view").text(product.GPU || "N/A");
                    $("#product-vga-view").text(product.VGA || "N/A");
                    $("#product-ram-view").text(product.RAM || "N/A");
                    $("#product-storage-view").text(product.Storage || "N/A");
                    $("#product-webcam-view").text(product.Webcam || "N/A");
                    $("#product-battery-view").text(product.Battery || "N/A");
                    $("#product-os-view").text(product.OS || "N/A");
                    $("#product-screen-view").text(product.ScreenSize || "N/A");
                    $("#product-ports-view").text(product.Ports || "N/A");
                    $("#product-stock-view").text(product.StockQuantity || "N/A");
                    $("#product-warranty-view").text(product.WarrantyPeriod || "N/A");
                    $("#product-image-view").attr("src", product.ImageUrl || "/default-image.jpg");

                    // Hiển thị modal hoặc trang chi tiết sản phẩm
                    $("#product-details").css("display", "block");
                    $(".tab-content-container").css("display", "none");
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Lỗi khi lấy thông tin sản phẩm.");
            }
        });
    });

    // Xử lý nút "Quay lại"
    $("#close-details-btn").on("click", function () {
        $("#product-details").css("display", "none");
        $(".tab-content-container").css("display", "block");
    });

    $("#product-table").on("click", ".delete-product", function () {
        const rowData = table.row($(this).parents('tr')).data();
        const productId = rowData.id; // Lấy id của sản phẩm từ dòng hiện tại

        // Sử dụng SweetAlert để xác nhận việc xóa
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn muốn xóa sản phẩm này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ'
        }).then((result) => {
            if (result.isConfirmed) {
                // Gửi yêu cầu xóa sản phẩm qua API
                $.ajax({
                    url: `/Admin/DeleteProduct?productId=${productId}`,
                    type: "POST",
                    success: function (response) {
                        if (response.success) {
                            Swal.fire(
                                'Đã xóa!',
                                'Sản phẩm đã được xóa thành công.',
                                'success'
                            );
                            // Reload lại DataTable sau khi xóa
                            table.ajax.reload();
                        } else {
                            Swal.fire(
                                'Lỗi!',
                                response.message || 'Không thể xóa sản phẩm.',
                                'error'
                            );
                        }
                    },
                    error: function () {
                        Swal.fire(
                            'Lỗi!',
                            'Đã xảy ra lỗi khi xóa sản phẩm.',
                            'error'
                        );
                    }
                });
            }
        });
    });

    $(".add-product").on("click", function () {
        $("#overlay").addClass("active"); // Thêm class active để modal hiển thị
    });

    // Đóng Modal khi nhấn nút "Đóng"
    $("#close-form").on("click", function () {
        $("#overlay").removeClass("active"); // Xóa class active để ẩn modal
    });

    $("#product-images").on("change", function () {
        const uploadedImages = this.files;

        console.log("Danh sách file:");
        for (let i = 0; i < uploadedImages.length; i++) {
            console.log(`File ${i}:`, uploadedImages[i].name);
        }
    });



    $("#save-product").on("click", function () {
        // Thu thập dữ liệu từ form
        const formData = new FormData();
        const productName = $("#product-name").val();
        const productPrice = $("#product-price").val();
        const productRating = $("#product-rating").val();
        const productDiscount = $("#product-discount").val();
        const productCategory = $("#product-category").val();
        const productBrand = $("#product-brand").val();
        const productWeight = $("#product-weight").val();
        const productQuantity = $("#product-quantity").val();
        const productPort = $("#product-port").val();
        const productCPU = $("#product-cpu").val();
        const productGPU = $("#product-gpu").val();
        const productVGA = $("#product-vga").val();
        const productRAM = $("#product-ram").val();
        const productStorage = $("#product-storage").val();
        const productWebcam = $("#product-webcam").val();
        const productBattery = $("#product-battery").val();
        const productOS = $("#product-os").val();
        const productScreenSize = $("#product-screen-size").val();
        const productWarranty = $("#product-warranty").val();
        const uploadedImages = $("#product-images")[0].files;

        // Kiểm tra dữ liệu
        if (!productName || !productPrice || uploadedImages.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin và tải lên ít nhất 1 hình ảnh!");
            return;
        }



        // Thêm dữ liệu vào FormData
        formData.append("ProductName", productName);
        formData.append("UnitPrice", productPrice);
        formData.append("Rating", productRating);
        formData.append("DiscountPercent", productDiscount);
        formData.append("CategoryId", productCategory);
        formData.append("BrandId", productBrand);
        formData.append("Weight", productWeight);
        formData.append("StockQuantity", productQuantity);
        formData.append("Ports", productPort);
        formData.append("CPU", productCPU);
        formData.append("GPU", productGPU);
        formData.append("VGA", productVGA);
        formData.append("RAM", productRAM);
        formData.append("Storage", productStorage);
        formData.append("Webcam", productWebcam);
        formData.append("Battery", productBattery);
        formData.append("OS", productOS);
        formData.append("ScreenSize", productScreenSize);
        formData.append("WarrantyPeriod", productWarranty);

        // Thêm hình ảnh vào FormData
        for (let i = 0; i < uploadedImages.length; i++) {
            formData.append(`uploadedImages[${i}]`, uploadedImages[i]);
        }

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        // Gửi yêu cầu AJAX đến API
        $.ajax({
            url: "/Admin/AddProduct", // URL Controller
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    alert("Sản phẩm đã được thêm thành công!");
                    $("#overlay").removeClass("active"); // Ẩn modal
                    location.reload(); // Reload trang
                } else {
                    alert("Thêm sản phẩm thất bại: " + response.message);
                }
            },
            error: function () {
                alert("Đã xảy ra lỗi khi thêm sản phẩm.");
            }
        });
    });

    // Đóng Modal khi nhấn nút "Đóng"
    $("#close-form").on("click", function () {
        $("#overlay").removeClass("active"); // Xóa class active để ẩn modal
    });
});

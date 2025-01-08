$(document).ready(function () {
    const itemsPerPage = 6; // Số sản phẩm trên mỗi trang
    const productItems = $(".product-item"); // Lấy tất cả sản phẩm
    const totalItems = productItems.length; // Tổng số sản phẩm

    // Hàm hiển thị sản phẩm theo trang
    function showPage(page) {
        productItems.hide(); // Ẩn tất cả sản phẩm
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        productItems.slice(start, end).show(); // Hiển thị sản phẩm thuộc trang hiện tại
    }

    // Cấu hình SimplePagination.js
    $("#pagination-container").pagination({
        items: totalItems, // Tổng số sản phẩm
        itemsOnPage: itemsPerPage, // Số sản phẩm trên mỗi trang
        cssStyle: "light-theme", // Giao diện phân trang
        onPageClick: function (pageNumber) {
            showPage(pageNumber); // Hiển thị sản phẩm khi nhấn vào số trang
        }
    });

    // Hiển thị trang đầu tiên khi tải trang
    showPage(1);
});

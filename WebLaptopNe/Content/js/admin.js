
//document.addEventListener("DOMContentLoaded", function () {
//  const bar = document.querySelector(".fa-bars");
//  const sidebar = document.querySelector(".sidebar");
//  const navItemsP = document.querySelectorAll(".nav-item p");
//  const navItems = document.querySelectorAll(".nav-item");
//  const tabContents = document.querySelectorAll(".tab-content");
//  const mainContent = document.querySelector(".main-content");
//  const shortTexts = [
//    "Dashboard",
//    "Sản phẩm",
//    "Khách hàng",
//    "Đơn hàng",
//    "Doanh thu",
//    "Khuyến mãi",
//    "Tài khoản",
//  ];
//  const fullTexts = [
//    "Dashboard",
//    "Quản lý kho hàng",
//    "Quản lý khách hàng",
//    "Quản lý đơn hàng",
//    "Thống kê doanh thu",
//    "Quản lý khuyến mãi",
//    "Quản lý tài khoản",
//  ];
//  const saveProductBtn = document.getElementById("save-product");
//  const overlays = document.querySelectorAll(".overlay");
//  const cancelAdd = document.querySelectorAll(".fa-xmark");
//  const productTableBody = document.getElementById("product-table-body");
//  const cusTableBody = document.getElementById("customer-table-body");

//  // Toggle sidebar
//  bar.addEventListener("click", function () {
//    sidebar.classList.toggle("expanded");
//    mainContent.classList.toggle("collapsed");
//    navItemsP.forEach((item, index) => {
//      item.textContent = sidebar.classList.contains("expanded")
//        ? shortTexts[index]
//        : fullTexts[index];
//    });
//  });

//  // Tab navigation
//  navItems.forEach((item) => {
//    item.addEventListener("click", (e) => {
//      const index = item.getAttribute("data-index");
//      tabContents.forEach((content) => {
//        content.style.display = "none";
//      });
//      navItems.forEach((nav) => {
//        nav.classList.remove("active");
//      });
//      tabContents[index].style.display = "block";
//      item.classList.add("active");

//      tabContents.forEach((tab) => {
//        tab.classList.remove("active"); // Xóa class active
//      });
//    });
//  });

//  tabContents[0].style.display = "block"; // Show the first tab by default
//  navItems[0].classList.add("active"); // Activate the first tab by default

//  // Trang product========================================

//  // Load product table
//  function loadProductTable(products = productData) {
//    productTableBody.innerHTML = "";
//    products.forEach((item) => {
//      const newRow = document.createElement("tr");
//      newRow.innerHTML = `
//                <td>${item.id}</td>
//                <td>
//                      <img src="${item.urlImage}" alt="" class = "row-image-item">
//                </td>
//                <td>${item.name}</td>
//                <td>${item.price}</td>
//                <td>${item.nameCate}</td>
//                <td>${item.dateCreate}</td>
//                <td><button class="view-details view-details-product">Xem chi tiết</button></td>
//                <td>
//                    <button class="delete-product" data-id="${item.id}">
//                        <i class="fa-regular fa-trash-can"></i>
//                    </button>
//                </td>
//            `;
//      productTableBody.appendChild(newRow);
//    });
//  }
//  // Tái sử dụng hàm search chỉ cho tên sản phẩm
//  // Tái sử dụng hàm search cho cả sản phẩm và khách hàng
//  function searchProducts(
//    searchBtnId,
//    searchInputId,
//    data,
//    loadFunction,
//    searchField
//  ) {
//    document.getElementById(searchBtnId).addEventListener("click", () => {
//      const searchTerm = document
//        .getElementById(searchInputId)
//        .value.toLowerCase();
//      const filteredData = data.filter((item) =>
//        item[searchField].toLowerCase().includes(searchTerm)
//      );
//      loadFunction(filteredData); // Gọi hàm load với dữ liệu đã lọc
//    });
//  }

//  function loadCustomerTable(cus = customerData) {
//    cusTableBody.innerHTML = "";
//    cus.forEach((item) => {
//      const newRow = document.createElement("tr");
//      newRow.innerHTML = `
//                <td>${item.id}</td>
//                <td>${item.name}</td>
//                <td>${item.email}</td>
//                <td>${item.phone}</td>
//                <td>${item.address}</td>
//                <td>${item.registeredDate}</td>
//                <td><button class="view-details">Xem chi tiết</button></td>
//            `;
//      cusTableBody.appendChild(newRow);
//    });
//  }

//  // Gọi hàm tìm kiếm cho sản phẩm chỉ theo tên
//  searchProducts(
//    "search-btn-product",
//    "product-search",
//    productData,
//    loadProductTable,
//    "name"
//  );
//  searchProducts(
//    "search-btn-cus",
//    "customer-search",
//    customerData,
//    loadCustomerTable,
//    "name"
//  );
//  searchProducts(
//    "search-btn-order",
//    "order-search",
//    orderData,
//    loadOrderTable,
//    "customerName"
//  );

//  //Bật overlay
//  function toggleOverlayByIndex(overlays, index) {
//    overlays.forEach((overlay) => {
//      if (parseInt(overlay.getAttribute("data-index")) === index) {
//        overlay.classList.add("active");
//      } else {
//        overlay.classList.remove("active");
//      }
//    });
//  }

//  // tắt overlay
//  cancelAdd.forEach((btn) => {
//    btn.addEventListener("click", function () {
//      document.querySelectorAll(".overlay").forEach((overlay) => {
//        overlay.classList.remove("active");
//      });

//      // Reset form (nếu cần thiết)
//      const productForm = document.getElementById("product-form");
//      if (productForm) productForm.reset();
//    });
//  });

//  document.querySelector(".add-product").addEventListener("click", function () {
//    toggleOverlayByIndex(overlays, 0);
//  });
//  document
//    .querySelector(".add-category")
//    .addEventListener("click", function () {
//      toggleOverlayByIndex(overlays, 1);
//    });

//  saveProductBtn.addEventListener("click", () => {
//    const productId = document.getElementById("product-id").value;
//    const productImage = document.getElementById("product-image").value;
//    const productName = document.getElementById("product-name").value;
//    const productPrice = document.getElementById("product-price").value;
//    const productCategory = document.getElementById("product-category").value;
//    const productDate = document.getElementById("product-date").value;

//    productData.push({
//      id: productId,
//      name: productName,
//      urlImage: productImage,
//      price: productPrice,
//      discountPercent: "",
//      desc: "",
//      idCate: "01",
//      cateName: productCategory,
//      dateCreate: productDate,
//    });

//    loadProductTable();

//    document.getElementById("product-form").reset();
//    overlay.classList.remove("active");
//  });

//  // Xóa row khi ấn vào nút xóa
//  document
//    .querySelector("#product-table-body")
//    .addEventListener("click", function (e) {
//      const deleteButton = e.target.closest(".delete-product");
//      if (deleteButton) {
//        const productId = deleteButton.getAttribute("data-id");
//        showCustomConfirm(
//          `Bạn có chắc chắn muốn xóa đơn hàng ID: ${productId}?`,
//          function () {
//            deleteProductById(productId);
//            showNotification(`Sản phẩm với ID ${productId} đã bị xóa.`);
//            loadProductTable(productData);
//          }
//        );
//      }
//    });

//  function deleteProductById(productId) {
//    const index = productData.findIndex((product) => product.id === productId);
//    if (index !== -1) {
//      productData.splice(index, 1); // Xóa phần tử khỏi mảng
//    }
//  }

//  // Trang khách hàng
//  function loadCustomerTable(cus = customerData) {
//    cusTableBody.innerHTML = "";
//    cus.forEach((item) => {
//      const newRow = document.createElement("tr");
//      newRow.innerHTML = `
//                <td>${item.id}</td>
//                <td>${item.name}</td>
//                <td>${item.email}</td>
//                <td>${item.phone}</td>
//                <td>${item.address}</td>
//                <td>${item.registeredDate}</td>
//                <td><button class="view-details">Xem chi tiết</button></td>
//            `;
//      cusTableBody.appendChild(newRow);
//    });
//  }

//  cusTableBody.addEventListener("click", function (e) {
//    if (e.target && e.target.classList.contains("view-details")) {
//      toggleOverlayByIndex(overlays, 2);
//    }
//  });

//  loadCustomerTable();

//  function sortCustomers(option) {
//    const sortedCustomers = [...customerData];
//    switch (option) {
//      case "date-desc":
//        sortedCustomers.sort(
//          (a, b) => new Date(b.registeredDate) - new Date(a.registeredDate)
//        );
//        break;
//      default:
//        console.log("Tùy chọn không hợp lệ.");
//        break;
//    }
//    loadCustomerTable(sortedCustomers);
//  }

//  // Thêm sự kiện cho nút sắp xếp
//  document
//    .querySelector("#sort-btn-cus")
//    .addEventListener("click", function () {
//      const selectedOption = document.querySelector(
//        "#sort-select-customer"
//      ).value;
//      if (selectedOption) {
//        sortCustomers(selectedOption);
//      } else {
//        showNotification("Vui lòng chọn một tùy chọn sắp xếp.", "error");
//      }
//    });

//  // Trang đơn hàng ===========================================================
//  const orderTableBody = document.getElementById("order-table-body");

//  function loadOrderTable(orders = orderData) {
//    orderTableBody.innerHTML = "";

//    orders.forEach((order) => {
//      const row = document.createElement("tr");
//      row.innerHTML = `
//        <td>${order.id}</td>
//        <td>${order.customerName}</td>
//        <td>${order.orderDate}</td>
//        <td>${order.expectedDeliveryDate}</td>
//        <td>${order.address}</td>
//        <td>${order.status}</td>
//        <td><button class="view-details">Chi tiết</button></td>
//        <td>
//          ${
//            order.status === "Chờ xử lý"
//              ? `
//            <button class="approve-order" onclick="approveOrder('${order.id}')"><i class="fa-solid fa-check"></i></button>
//            <button class="reject-order" onclick="rejectOrder('${order.id}')"><i class="fa-solid fa-times"></i></button>
//          `
//              : ""
//          }
//        </td>
//      `;
//      orderTableBody.appendChild(row);
//    });
//  }

//  // Ví dụ gọi hàm loadOrderTable để hiển thị `orderData`
//  loadOrderTable(orderData);

//  orderTableBody.addEventListener("click", function (event) {
//    if (event.target && event.target.classList.contains("view-details")) {
//      toggleOverlayByIndex(overlays, 3);
//    }
//  });

//  const sortSelect = document.getElementById("sort-select-order");
//  const sortButton = document.getElementById("sort-btn-order");
//  // Hàm lọc danh sách đơn hàng
//  sortButton.addEventListener("click", function () {
//    const sortValue = sortSelect.value; // Lấy giá trị từ select
//    let filteredOrders = [...orderData]; // Tạo bản sao dữ liệu đơn hàng

//    switch (sortValue) {
//      case "pending-orders": // Đơn hàng chưa duyệt
//        filteredOrders = filteredOrders.filter(
//          (order) => order.status === "Chờ xử lý"
//        );
//        break;
//      case "in-progress-orders": // Đơn hàng đang giao
//        filteredOrders = filteredOrders.filter(
//          (order) => order.status === "Đang giao"
//        );
//        break;
//      case "completed-orders": // Đơn hàng đã giao
//        filteredOrders = filteredOrders.filter(
//          (order) => order.status === "Đã giao"
//        );
//        break;
//      default:
//        // Nếu không chọn gì, hiển thị tất cả
//        filteredOrders = [...orderData];
//        break;
//    }

//    // Gọi hàm để hiển thị đơn hàng sau khi lọc
//    loadOrderTable(filteredOrders);
//  });

//  // Hàm xử lý duyệt đơn hàng
//  window.approveOrder = function (orderId) {
//    const order = orderData.find((order) => order.id === orderId);

//    if (order) {
//      order.status = "Đã duyệt";
//      showNotification(`Đơn hàng ID: ${orderId} đã được duyệt!`);
//      loadOrderTable(orderData);
//    } else {
//      showNotification(`Không tìm thấy đơn hàng với ID: ${orderId}`, "error");
//    }
//  };

//  window.rejectOrder = function (orderId) {
//    showCustomConfirm(
//      `Bạn có chắc chắn muốn xóa đơn hàng ID: ${orderId}?`,
//      function () {
//        const index = orderData.findIndex(
//          (order) => String(order.id) === String(orderId)
//        );
//        if (index !== -1) {
//          orderData.splice(index, 1); // Xóa phần tử tại vị trí index
//        }
//        showNotification(`Đơn hàng ID: ${orderId} đã bị xóa!`);
//        loadOrderTable(orderData); // Cập nhật lại bảng
//      }
//    );
//  };
//  // ----Ket thuc trang don hang ============================

//  // Trang thống kê

//  // Dữ liệu cho biểu đồ khách hàng
//  const data = {
//    labels: ["Khách hàng mới", "Khách hàng thường xuyên", "Khác"], // Các nhãn
//    datasets: [
//      {
//        data: [30, 50, 20],
//        backgroundColor: ["#4ECDC4", "#FF6B6B", "#FFE66D"],
//        borderColor: "#fff",
//        borderWidth: 2,
//      },
//    ],
//  };

//  // Cấu hình biểu đồ
//  const config = {
//    type: "doughnut",
//    data: data,
//    options: {
//      responsive: true,
//      cutout: "85%",
//      plugins: {
//        legend: {
//          position: "bottom",
//        },
//        tooltip: {
//          enabled: true,
//        },
//      },
//    },
//  };

//  const ctx2 = document.getElementById("customerPieChart").getContext("2d");

//  // Khởi tạo biểu đồ
//  new Chart(ctx2, config);

//  const ctx = document.getElementById("revenueChart").getContext("2d");

//  // Dữ liệu doanh thu và số lượng sản phẩm bán được cho 12 tháng
//  const months = [
//    "Jan",
//    "Feb",
//    "Mar",
//    "Apr",
//    "May",
//    "Jun",
//    "Jul",
//    "Aug",
//    "Sep",
//    "Oct",
//    "Nov",
//    "Dec",
//  ];
//  const revenue = [
//    100000, 150000, 130000, 180000, 20000, 25000, 30000, 40000, 50000, 60000,
//    70000, 80000,
//  ];
//  const quantitySold = [120, 150, 170, 200, 50, 60, 70, 80, 90, 100, 110, 120];

//  // Vẽ biểu đồ
//  new Chart(ctx, {
//    type: "bar",
//    data: {
//      labels: months,
//      datasets: [
//        {
//          label: "Doanh thu (VND)",
//          data: revenue,
//          backgroundColor: "rgba(75, 192, 192, 0.3)",
//          borderColor: "rgba(75, 192, 192, 1)",
//          borderWidth: 1,
//          yAxisID: "y",
//          barPercentage: 0.8, // Giảm độ rộng của cột
//          categoryPercentage: 0.9, // Đưa cột sát với cạnh bên
//        },
//        {
//          label: "Số lượng bán được",
//          data: quantitySold,
//          type: "line",
//          borderColor: "#FF5733",
//          backgroundColor: "rgba(255, 87, 51, 0.3)",
//          borderWidth: 2,
//          fill: true,
//          tension: 0.3,
//          yAxisID: "y1",
//          pointBackgroundColor: "#FF5733",
//          pointRadius: 4,
//        },
//      ],
//    },
//    options: {
//      responsive: true,
//      plugins: {
//        tooltip: {
//          mode: "index",
//          intersect: false,
//        },
//        legend: {
//          position: "top",
//          labels: {
//            font: {
//              size: 14,
//            },
//          },
//        },
//      },
//      layout: {
//        padding: {
//          left: 0, // Loại bỏ padding bên trái
//          right: 0,
//        },
//      },
//      scales: {
//        x: {
//          ticks: {
//            font: {
//              size: 12,
//            },
//          },
//        },
//        y: {
//          type: "linear",
//          display: true,
//          position: "left",
//          title: {
//            display: true,
//            text: "Doanh thu (VND)",
//          },
//          ticks: {
//            color: "rgba(75, 192, 192, 1)",
//          },
//          beginAtZero: true, // Bắt đầu từ 0
//        },
//        y1: {
//          type: "linear",
//          display: true,
//          position: "right",
//          grid: {
//            drawOnChartArea: false,
//          },
//          title: {
//            display: true,
//            text: "Số lượng sản phẩm",
//          },
//          ticks: {
//            color: "#FF5733",
//          },
//        },
//      },
//    },
//  });

//  function showDateInputs(value) {
//    var monthInputGroup = document.getElementById("month-input-group");

//    if (value === "monthly") {
//      monthInputGroup.style.display = "block";
//    } else {
//      monthInputGroup.style.display = "none";
//    }
//  }

//  document
//    .getElementById("statistic-type")
//    .addEventListener("change", function () {
//      var value = this.value;
//      showDateInputs(value);
//    });

//  // Hàm xử lý khi nhấn nút "Xem Thống Kê"
//  // Hàm xử lý khi nhấn nút "Xem Thống Kê"
//  function processInput() {
//    var year = document.getElementById("month").value; // lấy giá trị năm
//    var statisticType = document.getElementById("statistic-type").value; // lấy loại thống kê (theo tháng hay theo năm)

//    if (statisticType === "monthly" && !year) {
//      alert("Vui lòng nhập năm.");
//      return;
//    }

//    // Nếu chọn thống kê theo tháng, lấy dữ liệu tháng; nếu chọn theo năm, lấy dữ liệu năm
//    var revenueData =
//      statisticType === "monthly"
//        ? getMonthlyRevenueData(year)
//        : getYearlyRevenueData();
//    generateChart(revenueData, statisticType);
//  }

//  // Giả lập dữ liệu doanh thu và sản phẩm bán được theo tháng (cần thay thế bằng dữ liệu thực tế)
//  function getMonthlyRevenueData(year) {
//    return {
//      labels: [
//        "Tháng 1",
//        "Tháng 2",
//        "Tháng 3",
//        "Tháng 4",
//        "Tháng 5",
//        "Tháng 6",
//        "Tháng 7",
//        "Tháng 8",
//        "Tháng 9",
//        "Tháng 10",
//        "Tháng 11",
//        "Tháng 12",
//      ],
//      datasets: [
//        {
//          label: "Doanh thu",
//          data: [
//            5000, 7000, 4000, 6000, 8000, 9000, 6500, 7500, 6700, 8000, 8500,
//            9500,
//          ],
//          borderColor: "rgba(75, 192, 192, 1)",
//          backgroundColor: "rgba(75, 192, 192, 0.2)",
//          fill: true,
//        },
//        {
//          label: "Sản phẩm bán được",
//          data: [150, 200, 120, 180, 220, 250, 190, 210, 180, 230, 240, 260],
//          borderColor: "rgba(153, 102, 255, 1)",
//          backgroundColor: "rgba(153, 102, 255, 0.2)",
//          fill: true,
//        },
//      ],
//    };
//  }

//  // Giả lập dữ liệu doanh thu và sản phẩm bán được theo năm (cần thay thế bằng dữ liệu thực tế)
//  function getYearlyRevenueData() {
//    return {
//      labels: ["2020", "2021", "2022", "2023", "2024"],
//      datasets: [
//        {
//          label: "Doanh thu",
//          data: [50000, 70000, 60000, 80000, 90000],
//          borderColor: "rgba(75, 192, 192, 1)",
//          backgroundColor: "rgba(75, 192, 192, 0.2)",
//          fill: true,
//        },
//        {
//          label: "Sản phẩm bán được",
//          data: [1500, 2000, 1800, 2200, 2500],
//          borderColor: "rgba(153, 102, 255, 1)",
//          backgroundColor: "rgba(153, 102, 255, 0.2)",
//          fill: true,
//        },
//      ],
//    };
//  }

//  // Hàm tạo biểu đồ
//  function generateChart(data, statisticType) {
//    var ctx = document.getElementById("revenue-chart").getContext("2d");

//    if (window.myChart) {
//      window.myChart.destroy(); // Hủy bỏ biểu đồ cũ nếu có
//    }

//    window.myChart = new Chart(ctx, {
//      type: "line",
//      data: data,
//      options: {
//        responsive: true,
//        scales: {
//          x: {
//            title: {
//              display: true,
//              text: statisticType === "monthly" ? "Tháng" : "Năm",
//            },
//          },
//          y: {
//            title: {
//              display: true,
//              text: "Giá trị",
//            },
//          },
//        },
//      },
//    });
//  }

//  // Thêm sự kiện cho nút "Xem Thống Kê"
//  document.getElementById("submit-btn").addEventListener("click", processInput);

//  // Thêm sự kiện khi thay đổi lựa chọn thống kê (theo tháng hoặc theo năm)
//  document
//    .getElementById("statistic-type")
//    .addEventListener("change", function () {
//      var statisticType = this.value;
//      if (statisticType === "monthly") {
//        document.getElementById("month").placeholder = "Nhập năm"; // Hiển thị placeholder "Nhập năm" khi chọn thống kê theo tháng
//      } else {
//        document.getElementById("month").placeholder = ""; // Không yêu cầu nhập tháng nếu chọn thống kê theo năm
//      }
//    });

//  // Code phần chi tiết sản phẩm
//  productTableBody.addEventListener("click", function (event) {
//    if (
//      event.target &&
//      event.target.classList.contains("view-details-product")
//    ) {
//      document.querySelector(".tab-content-container").style.display = "none";
//      document.querySelector(".product-details").style.display = "block";
//      document.querySelector(".product-stats").style.display = "none";
//    }
//  });

//  document
//    .getElementById("close-details-btn")
//    .addEventListener("click", function () {
//      document.querySelector(".product-details").style.display = "none";
//      document.querySelector(".tab-content-container").style.display = "block";
//      document.querySelector(".product-stats").style.display = "flex";
//    });

//  // Hàm chuyển sang chế độ chỉnh sửa
//  document
//    .getElementById("edit-product-btn")
//    .addEventListener("click", function () {
//      // Lấy tất cả các phần tử `span` và `input` bên trong div .details-content
//      const detailsContent = document.querySelector(".details-content");

//      const spans = detailsContent.querySelectorAll("span");
//      const inputs = detailsContent.querySelectorAll("input, textarea");

//      // Ẩn tất cả các `span` (view) và hiển thị tất cả các `input` (edit)
//      spans.forEach((span) => {
//        span.style.display = "none";
//      });

//      inputs.forEach((input) => {
//        input.style.display = "block";
//      });

//      // Hiển thị nút Lưu, Ẩn nút Chỉnh sửa
//      document.getElementById("save-product-btn").style.display = "block";
//      document.getElementById("edit-product-btn").style.display = "none";
//    });

//  // Hàm lưu thay đổi
//  document
//    .getElementById("save-product-btn")
//    .addEventListener("click", function () {
//      // Lấy tất cả các phần tử `span` và `input` bên trong div .details-content
//      const detailsContent = document.querySelector(".details-content");

//      const spans = detailsContent.querySelectorAll("span");
//      const inputs = detailsContent.querySelectorAll("input, textarea");

//      // Cập nhật giá trị từ `input` sang `span`
//      inputs.forEach((input) => {
//        const correspondingSpan = input.previousElementSibling; // Lấy span liền trước input
//        if (correspondingSpan) {
//          correspondingSpan.textContent = input.value;
//        }
//      });

//      // Hiển thị lại tất cả các `span` và ẩn tất cả các `input`
//      spans.forEach((span) => {
//        span.style.display = "inline";
//      });

//      inputs.forEach((input) => {
//        input.style.display = "none";
//      });

//      // Hiển thị nút Chỉnh sửa, Ẩn nút Lưu
//      document.getElementById("save-product-btn").style.display = "none";
//      document.getElementById("edit-product-btn").style.display = "block";
//    });
//  // Code trang phiếu khuyến mãi ------------------------------------------

//  // Gán sự kiện cho các nút "Xóa"
//  const discountList = document.querySelector(".list-discount");
//  const notification = document.getElementById("notification");
//  const customConfirm = document.getElementById("custom-confirm");
//  const confirmMessage = document.getElementById("confirm-message");
//  const confirmOk = document.getElementById("confirm-ok");
//  const confirmCancel = document.getElementById("confirm-cancel");
//  const addDiscountBtn = document.getElementById("add-discount-btn");
//  let editingRow = null; // Lưu trữ hàng đang chỉnh sửa
//  const discountCodeInput = document.getElementById("discount-code");
//  const discountPercentInput = document.getElementById("discount-percent");
//  const discountExpiryInput = document.getElementById("discount-expiry");
//  const discountForm = document.getElementById("discount-form");

//  discountList.addEventListener("click", function (e) {
//    if (e.target.tagName === "BUTTON" && e.target.textContent === "Xóa") {
//      const row = e.target.closest("tr");
//      const discountCode = row.cells[0].textContent;

//      // Hiển thị khung xác nhận tùy chỉnh
//      showCustomConfirm(
//        `Bạn có chắc chắn muốn xóa mã giảm giá ${discountCode}?`,
//        function () {
//          row.remove(); // Xóa hàng khỏi bảng
//          showNotification(`Phiếu giảm giá ${discountCode} đã bị xóa.`);
//        }
//      );
//    }

//    if (e.target.tagName === "BUTTON" && e.target.textContent === "Chỉnh sửa") {
//      const row = e.target.closest("tr"); // Lấy hàng chứa nút "Chỉnh sửa"
//      editingRow = row; // Lưu hàng đang chỉnh sửa

//      // Lấy dữ liệu từ hàng
//      const discountCode = row.cells[0].textContent; // Mã giảm giá
//      const discountPercent = row.cells[1].textContent.replace("%", ""); // Mức giảm
//      const discountExpiry = row.cells[3].textContent; // Ngày hết hạn (dd/MM/yyyy)

//      // Chuyển đổi định dạng ngày từ dd/MM/yyyy sang yyyy-MM-dd
//      const formattedExpiryDate = formatDateToDDMMYYYY(discountExpiry);

//      // Điền dữ liệu vào form
//      discountCodeInput.value = discountCode;
//      discountPercentInput.value = discountPercent;
//      discountExpiryInput.value = formattedExpiryDate; // Gán ngày đã định dạng (yyyy-MM-dd)

//      // Đổi nút "THÊM PHIẾU GIẢM GIÁ" thành "CẬP NHẬT"
//      addDiscountBtn.textContent = "CẬP NHẬT";
//      addDiscountBtn.classList.add("toggleEdit");
//      console.log(`Đang chỉnh sửa phiếu giảm giá: ${discountCode}`);
//    }
//    function formatDateToDDMMYYYY(dateString) {
//      const [day, month, year] = dateString.split("/");
//      return `${year}-${month}-${day}`;
//    }
//  });

//  addDiscountBtn.addEventListener("click", function (e) {
//    e.preventDefault();

//    if (addDiscountBtn.classList.contains("toggleEdit")) {
//      // Nếu nút có class toggleEdit => Xử lý cập nhật
//      if (editingRow) {
//        // Cập nhật dữ liệu trong bảng
//        editingRow.cells[0].textContent = discountCodeInput.value.trim(); // Mã giảm giá
//        editingRow.cells[1].textContent = `${discountPercentInput.value.trim()}%`; // Mức giảm
//        editingRow.cells[3].textContent = discountExpiryInput.value.trim(); // Ngày hết hạn

//        showNotification(
//          `Cập nhật thành công mã giảm giá: ${discountCodeInput.value.trim()}`
//        );

//        // Reset trạng thái
//        editingRow = null;
//        discountForm.reset();
//        addDiscountBtn.textContent = "THÊM PHIẾU GIẢM GIÁ";
//        addDiscountBtn.classList.remove("toggleEdit"); // Bỏ class toggleEdit
//      }
//    } else {
//      // Nếu nút không có class toggleEdit => Xử lý thêm mới
//      const discountCode = discountCodeInput.value.trim(); // Mã giảm giá
//      const discountPercent = discountPercentInput.value.trim(); // Mức giảm
//      const discountExpiry = discountExpiryInput.value.trim(); // Ngày hết hạn

//      // Kiểm tra dữ liệu nhập vào
//      if (!discountCode || !discountPercent || !discountExpiry) {
//        showNotification(
//          "Vui lòng điền đầy đủ thông tin phiếu giảm giá!",
//          "error"
//        );
//        return;
//      }

//      // Tạo một hàng mới
//      const newRow = document.createElement("tr");
//      newRow.innerHTML = `
//        <td>${discountCode}</td>
//        <td>${discountPercent}%</td>
//        <td>${new Date().toISOString().split("T")[0]}</td> <!-- Ngày bắt đầu -->
//        <td>${discountExpiry}</td>
//        <td>
//          <button class="edit-btn">Chỉnh sửa</button>
//          <button class="delete-btn">Xóa</button>
//        </td>
//      `;

//      // Thêm hàng mới vào bảng
//      discountList.querySelector("tbody").appendChild(newRow);

//      // Thông báo
//      showNotification(`Đã thêm phiếu giảm giá: ${discountCode}`);

//      // Reset form
//      discountForm.reset();
//    }
//  });

//  // End phiếu khuyến mãi  ==================

//  // Xử lý phần tài khoản
//  const accountForm = document.getElementById("add-account-form");
//  const usernameInput = document.getElementById("username");
//  const emailInput = document.getElementById("email");
//  const passwordInput = document.getElementById("password");
//  const confirmPasswordInput = document.getElementById("confirm-password");
//  const roleSelect = document.getElementById("role");
//  const searchInput = document.getElementById("account-search");
//  const searchButton = document.getElementById("search-btn-account");
//  const accountListTable = document.querySelector("#account-list tbody");
//  let accounts = [
//    { id: 1, username: "admin01", email: "admin01@example.com", role: "admin" },
//    {
//      id: 2,
//      username: "editor02",
//      email: "editor02@example.com",
//      role: "editor",
//    },
//  ];
//  renderAccountList();

//  // 1. Thêm hoặc cập nhật tài khoản
//  accountForm.addEventListener("submit", function (e) {
//    e.preventDefault(); // Ngăn chặn hành vi submit mặc định

//    const username = usernameInput.value.trim();
//    const email = emailInput.value.trim();
//    const password = passwordInput.value.trim();
//    const confirmPassword = confirmPasswordInput.value.trim();
//    const role = roleSelect.value;

//    // Kiểm tra thông tin đầu vào
//    if (!username || !email || !password || !confirmPassword || !role) {
//      showNotification("Vui lòng điền đầy đủ thông tin!", "error");
//      return;
//    }

//    // Kiểm tra mật khẩu khớp nhau
//    if (password !== confirmPassword) {
//      showNotification("Mật khẩu và xác nhận mật khẩu không khớp!", "error");
//      return;
//    }

//    if (!editingRow) {
//      // Thêm tài khoản mới
//      const newAccount = {
//        id: accounts.length + 1,
//        username,
//        email,
//        role,
//      };
//      accounts.push(newAccount);
//      showNotification("Tài khoản mới đã được thêm thành công!", "success");
//    } else {
//      // Cập nhật tài khoản
//      const accountId = editingRow.dataset.id;
//      const account = accounts.find((acc) => acc.id === parseInt(accountId));

//      if (account) {
//        account.username = username;
//        account.email = email;
//        account.role = role;
//        showNotification("Tài khoản đã được cập nhật thành công!", "success");
//        editingRow = null;
//      }
//    }

//    accountForm.reset();
//    renderAccountList();
//  });

//  // 2. Hiển thị danh sách tài khoản
//  function renderAccountList(filteredAccounts = accounts) {
//    accountListTable.innerHTML = ""; // Xóa danh sách cũ

//    filteredAccounts.forEach((account) => {
//      const row = document.createElement("tr");
//      row.dataset.id = account.id;

//      row.innerHTML = `
//      <td>${account.id}</td>
//      <td>${account.username}</td>
//      <td>${account.email}</td>
//      <td>${getRoleName(account.role)}</td>
//      <td>
//        <button class="edit-btn">Chỉnh sửa</button>
//        <button class="delete-btn">Xóa</button>
//      </td>
//    `;

//      accountListTable.appendChild(row);
//    });
//  }

//  // 3. Xử lý nút "Chỉnh sửa" và "Xóa"
//  accountListTable.addEventListener("click", function (e) {
//    const row = e.target.closest("tr");
//    const accountId = row ? row.dataset.id : null;

//    if (e.target.classList.contains("edit-btn")) {
//      document.querySelector(".primary-button").textContent = "Chỉnh sửa";
//      // Chỉnh sửa tài khoản
//      const account = accounts.find((acc) => acc.id === parseInt(accountId));
//      if (account) {
//        usernameInput.value = account.username;
//        emailInput.value = account.email;
//        roleSelect.value = account.role;

//        editingRow = row;
//      }
//    }

//    if (e.target.classList.contains("delete-btn")) {
//      // Xóa tài khoản
//      const account = accounts.find((acc) => acc.id === parseInt(accountId));
//      if (account) {
//        showCustomConfirm(
//          `Bạn có chắc chắn muốn xóa tài khoản ${account.username}?`,
//          function () {
//            accounts = accounts.filter((acc) => acc.id !== parseInt(accountId));
//            renderAccountList();
//            showNotification("Tài khoản đã được xóa thành công!", "success");
//          }
//        );
//      }
//    }
//  });

//  // 4. Tìm kiếm tài khoản
//  searchButton.addEventListener("click", function () {
//    const searchText = searchInput.value.trim().toLowerCase();
//    const filteredAccounts = accounts.filter(
//      (acc) =>
//        acc.username.toLowerCase().includes(searchText) ||
//        acc.email.toLowerCase().includes(searchText) ||
//        getRoleName(acc.role).toLowerCase().includes(searchText)
//    );

//    renderAccountList(filteredAccounts);
//  });

//  // Định nghĩa tên vai trò
//  function getRoleName(role) {
//    if (role === "admin") return "Quản trị viên";
//    if (role === "editor") return "Người chỉnh sửa";
//    if (role === "customer") return "Khách hàng";
//    return "Không xác định";
//  }

//  // Hiển thị thông báo
//  function showNotification(message, type = "success") {
//    const notification = document.createElement("div");
//    notification.className = `notification ${type}`;
//    notification.textContent = message;

//    document.body.appendChild(notification);

//    setTimeout(() => {
//      notification.remove();
//    }, 3000); // Tự động ẩn sau 3 giây
//  }

//  // Hiển thị hộp thoại xác nhận
//  function showCustomConfirm(message, onConfirm) {
//    const confirmBox = document.createElement("div");
//    confirmBox.className = "custom-confirm";

//    confirmBox.innerHTML = `
//    <p>${message}</p>
//    <div class="confirm-actions">
//      <button id="confirm-yes" class="confirm-btn">Có</button>
//      <button id="confirm-no" class="confirm-btn">Không</button>
//    </div>
//  `;

//    document.body.appendChild(confirmBox);

//    document.getElementById("confirm-yes").addEventListener("click", () => {
//      onConfirm();
//      confirmBox.remove();
//    });

//    document.getElementById("confirm-no").addEventListener("click", () => {
//      confirmBox.remove();
//    });
//  }

//  function showCustomConfirm(message, onConfirm) {
//    confirmMessage.textContent = message;
//    customConfirm.classList.remove("hidden");

//    // Xử lý sự kiện khi nhấn "Đồng ý"
//    confirmOk.onclick = function () {
//      customConfirm.classList.add("hidden");
//      onConfirm();
//    };

//    // Xử lý sự kiện khi nhấn "Hủy"
//    confirmCancel.onclick = function () {
//      customConfirm.classList.add("hidden");
//    };
//  }

//  function showNotification(message, status = "success") {
//    const notification = document.getElementById("notification");
//    const notificationMessage = document.getElementById("noti-message");
//    const notificationImg = document.getElementById("noti-img");

//    // Cập nhật nội dung và trạng thái
//    notificationMessage.textContent = message;

//    // Thay đổi icon tùy thuộc vào trạng thái
//    switch (status) {
//      case "success":
//        notificationImg.src = "./img/adminpage/checked.png";
//        break;
//      case "error":
//        notificationImg.src = "./img/adminpage/error.png";
//        break;
//      case "warning":
//        notificationImg.src = "./img/adminpage/warning.png";
//        break;
//      default:
//        notificationImg.src = "./img/adminpage/info.png";
//        break;
//    }

//    // Cập nhật lớp CSS
//    notification.classList.remove("success", "error", "warning", "hidden");
//    notification.classList.add("show", status);

//    // Ẩn thông báo sau 3 giây
//    setTimeout(() => {
//      notification.classList.remove("show");
//      notification.classList.add("hidden");
//    }, 3000);
//  }

//  // Danh sách thông báo mẫu
//  const notifications = [
//    {
//      title: "Cập nhật hệ thống",
//      message: "Hệ thống sẽ được bảo trì vào lúc 12:00 AM ngày 25/11/2023.",
//      time: "20/11/2023, 10:00 AM",
//    },

//    {
//      title: "Cập nhật hệ thống",
//      message: "Hệ thống sẽ được bảo trì vào lúc 12:00 AM ngày 25/11/2023.",
//      time: "20/11/2023, 10:00 AM",
//    },

//    {
//      title: "Cập nhật hệ thống",
//      message: "Hệ thống sẽ được bảo trì vào lúc 12:00 AM ngày 25/11/2023.",
//      time: "20/11/2023, 10:00 AM",
//    },

//    {
//      title: "Cập nhật hệ thống",
//      message: "Hệ thống sẽ được bảo trì vào lúc 12:00 AM ngày 25/11/2023.",
//      time: "20/11/2023, 10:00 AM",
//    },
//    {
//      title: "Sản phẩm mới",
//      message: "Sản phẩm mới đã được thêm vào danh mục Đèn chùm.",
//      time: "19/11/2023, 8:30 AM",
//    },
//    {
//      title: "Thông báo khuyến mãi",
//      message: "Giảm giá 20% cho tất cả các sản phẩm từ 20/11 đến 25/11.",
//      time: "18/11/2023, 3:15 PM",
//    },
//  ];

//  // Hàm hiển thị danh sách thông báo
//  function loadNotifications() {
//    const notificationList = document.querySelector(
//      ".notification-list-header"
//    );
//    const noneNoti = document.querySelector(".none-noti");

//    // Kiểm tra nếu không có thông báo
//    if (notifications.length === 0) {
//      noneNoti.style.display = "block"; // Hiển thị "Chưa có thông báo nào"
//      notificationList.style.display = "none"; // Ẩn danh sách thông báo
//    } else {
//      noneNoti.style.display = "none"; // Ẩn "Chưa có thông báo nào"
//      notificationList.style.display = "block"; // Hiển thị danh sách thông báo

//      // Thêm từng thông báo vào danh sách
//      notifications.forEach((noti) => {
//        const li = document.createElement("li");
//        li.innerHTML = `
//        <h4 class="noti-title">${noti.title}</h4>
//        <p class="noti-message">${noti.message}</p>
//        <span class="noti-time">${noti.time}</span>
//      `;
//        notificationList.appendChild(li);
//      });
//    }
//  }

//  // Gọi hàm khi tải trang
//  loadNotifications();

//  document.querySelector(".fa-bell").addEventListener("click", function () {
//    document
//      .querySelector(".notification-container")
//      .classList.toggle("hidden");
//  });

//  // Đăng xuất
//  document.getElementById("sign-up").addEventListener("click", function () {
//    showCustomConfirm("Bạn có muốn đăng xuất không?", function () {
//      window.location.href = "index.html";
//      sessionStorage.clear();
//    });
//  });

//  // Phân trang cho kho hàng
//  $(document).ready(function () {
//    // Kiểm tra và xóa <thead> cũ nếu tồn tại
//    $("#product-table thead").not(":first").remove();

//    // Khởi tạo DataTables
//    $("#product-table").DataTable({
//      data: productData, // Dữ liệu từ file data.js
//      destroy: true, // Xóa cấu hình DataTables cũ nếu có
//      autoWidth: false, // Tắt tự động điều chỉnh chiều rộng
//      paging: true, // Kích hoạt phân trang
//      pageLength: 10, // Hiển thị 20 dòng mỗi trang
//      columns: [
//        { data: "id" }, // Id
//        {
//          data: "urlImage", // Hình ảnh
//          render: function (data) {
//            return `<img src="${data}" alt="Product Image" style="width: 50px; height: 50px;">`;
//          },
//        },
//        { data: "name" }, // Tên sản phẩm
//        {
//          data: "price", // Giá
//          render: function (data) {
//            return parseInt(data).toLocaleString("vi-VN", {
//              style: "currency",
//              currency: "VND",
//            });
//          },
//        },
//        { data: "nameCate" }, // Loại sản phẩm
//        { data: "dateCreate" }, // Ngày thêm
//        {
//          data: null, // Thao tác
//          render: function (data, type, row) {
//            return `
//             <button class="view-details view-details-product">Xem chi tiết</button>
//            `;
//          },
//        },
//        {
//          data: null,
//          render: function (data, type, row) {
//            return `
            
//                    <button class="delete-product" data-id="${row.id}">
//                        <i class="fa-regular fa-trash-can"></i>
//                    </button>
//            `;
//          },
//        },
//      ],

//      lengthChange: false,
//      searching: false,
//      ordering: true,
//      info: true,
//      language: {
//        paginate: {
//          previous: "Trước",
//          next: "Tiếp",
//        },
//        info: "Hiển thị _START_ đến _END_ của _TOTAL_ sản phẩm",
//      },
//      initComplete: function () {
//        // Kiểm tra và xóa <thead> trùng lặp sau khi DataTables khởi tạo
//        $("#product-table thead").not(":first").remove();
//      },
//    });
//  });

//  // Phân trang cho khách hàng
//  $(document).ready(function () {
//    // Cấu hình DataTables
//    $(".customer-table").DataTable({
//      data: customerData, // Dữ liệu đầu vào
//      autoWidth: false,
//      paging: true, // Kích hoạt phân trang
//      pageLength: 10, // Hiển thị 20 dòng mỗi trang
//      columns: [
//        { data: "id", title: "Id" }, // Id khách hàng
//        { data: "name", title: "Tên khách hàng" }, // Tên khách hàng
//        { data: "email", title: "Email" }, // Email
//        { data: "phone", title: "Số điện thoại" }, // Số điện thoại
//        { data: "address", title: "Địa chỉ" }, // Địa chỉ
//        { data: "registeredDate", title: "Ngày đăng ký" }, // Ngày đăng ký
//        {
//          data: null,
//          render: function (data, type, row) {
//            return `
//            <button class="view-details">Xem chi tiết</button>
//            `;
//          },
//        },
//      ],
//      paging: true,
//      pageLength: 10,
//      lengthChange: false,
//      searching: false,
//      ordering: true,
//      info: true,
//      language: {
//        paginate: {
//          previous: "Trước",
//          next: "Tiếp",
//        },
//        info: "Hiển thị _START_ đến _END_ của _TOTAL_ khách hàng",
//      },
//    });
//  });

//  // Phân trang cho hóa đơn
//  $(document).ready(function () {
//    // Khởi tạo DataTables
//    $("#order-table").DataTable({
//      data: orderData,
//      destroy: true,
//      autoWidth: false,
//      paging: true,
//      pageLength: 10,
//      columns: [
//        { data: "id" },
//        { data: "customerName" },
//        { data: "orderDate" },
//        { data: "expectedDeliveryDate" },
//        { data: "address" },
//        { data: "status" },
//        {
//          data: null,
//          render: function (data) {
//            return `<button class="view-details">Chi tiết</button>`;
//          },
//        },
//        {
//          data: null, // Thao tác
//          render: function (data, type, row) {
//            if (row.status === "Chờ xử lý") {
//              return `
//                <button class="approve-order" onclick="approveOrder('${row.id}')">
//                  <i class="fa-solid fa-check"></i>
//                </button>
//                <button class="reject-order" onclick="rejectOrder('${row.id}')">
//                  <i class="fa-solid fa-times"></i>
//                </button>
//              `;
//            } else {
//              return "";
//            }
//          },
//        },
//      ],
//      lengthChange: false,
//      searching: false,
//      ordering: true,
//      info: true,
//      language: {
//        paginate: {
//          previous: "Trước",
//          next: "Tiếp",
//        },
//        info: "Hiển thị _START_ đến _END_ của _TOTAL_ sản phẩm",
//      },
//      initComplete: function () {
//        $("#product-table thead").not(":first").remove();
//      },
//    });
//  });

//  // Xử lý sự kiện khi form được submit
//  document
//    .getElementById("super-sale-form")
//    .addEventListener("submit", function (e) {
//      e.preventDefault(); // Ngăn reload trang

//      // Lấy giá trị từ các input
//      const saleTime = document.getElementById("sale-time").value.trim();
//      const productId = document.getElementById("product-id-sale").value.trim();
//      const productName = document
//        .getElementById("product-name-sale")
//        .value.trim();

//      // Kiểm tra dữ liệu rỗng
//      if (!saleTime || !productId || !productName) {
//        alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
//        return;
//      }

//      // Thêm sản phẩm vào danh sách
//      const tableBody = document.getElementById("super-sale-list");
//      const newRow = document.createElement("tr");

//      newRow.innerHTML = `
//    <td>${saleTime}</td>
//    <td>${productId}</td>
//    <td>${productName}</td>
//    <td>
//      <button class="edit-btn">Chỉnh sửa</button>
//      <button class="delete-btn">Xóa</button>
//    </td>
//  `;

//      tableBody.appendChild(newRow);

//      showNotification("Thêm sản phẩm thành công");
//      // Xóa nội dung các input sau khi thêm
//      document.getElementById("sale-time").value = "";
//      document.getElementById("product-id-sale").value = "";
//      document.getElementById("product-name-sale").value = "";
//    });

//  // Xử lý sự kiện chỉnh sửa và xóa
//  document
//    .getElementById("super-sale-list")
//    .addEventListener("click", function (e) {
//      const row = e.target.closest("tr"); // Lấy hàng chứa nút được click

//      // Xóa sản phẩm
//      if (e.target.classList.contains("delete-btn")) {
//        showCustomConfirm("Bạn có chắc mún xóa sản phẩm này", function () {
//          row.remove();
//          showNotification("Bạn đã xóa thành công");
//        });
//      }

//      // Chỉnh sửa sản phẩm
//      if (e.target.classList.contains("edit-btn")) {
//        const saleTimeCell = row.cells[0];
//        const productIdCell = row.cells[1];
//        const productNameCell = row.cells[2];

//        // Lấy giá trị hiện tại
//        const currentSaleTime = saleTimeCell.textContent;
//        const currentProductId = productIdCell.textContent;
//        const currentProductName = productNameCell.textContent;

//        // Hiển thị prompt để chỉnh sửa
//        const newSaleTime = prompt("Sửa thời gian giảm giá:", currentSaleTime);
//        const newProductId = prompt("Sửa ID sản phẩm:", currentProductId);
//        const newProductName = prompt("Sửa tên sản phẩm:", currentProductName);

//        // Cập nhật giá trị mới (nếu người dùng không bấm Hủy)
//        if (newSaleTime !== null) saleTimeCell.textContent = newSaleTime;
//        if (newProductId !== null) productIdCell.textContent = newProductId;
//        if (newProductName !== null)
//          productNameCell.textContent = newProductName;
//      }
//    });

//  // Dữ liệu mẫu cho Discount
//  const discountProducts = {
//    SALE20: ["Sản phẩm A", "Sản phẩm B", "Sản phẩm C"],
//    NEWYEAR30: ["Sản phẩm D", "Sản phẩm E"],
//  };

//  // Dữ liệu mẫu cho Super Sale
//  const superSaleData = [
//    {
//      id: "CT000",
//      startDate: "2024-11-01",
//      endDate: "2024-11-30",
//      programName: "Siêu Sale Tháng 11",
//      products: [
//        "SP001 - Áo thun",
//        "SP002 - Quần jeans",
//        "SP003 - Giày thể thao",
//      ],
//    },
//    {
//      id: "CT001",
//      startDate: "2024-12-01",
//      endDate: "2024-12-25",
//      programName: "Giáng Sinh Rực Rỡ",
//      products: ["SP004 - Váy nữ", "SP005 - Áo khoác"],
//    },
//  ];

//  // Đóng overlay
//  function closeOverlay() {
//    const overlays = document.querySelectorAll(".overlay");
//    overlays.forEach((overlay) => {
//      overlay.classList.remove("active");
//    });
//  }

//  // Gắn sự kiện cho nút đóng
//  document.querySelectorAll(".close-overlay-btn").forEach((btn) => {
//    btn.addEventListener("click", closeOverlay);
//  });

//  // Gán sự kiện cho Discount
//  document.querySelectorAll("#discount-list .view-details").forEach((item) => {
//    item.addEventListener("click", () => {
//      const discountCode = item.closest("tr").querySelector("td").innerText;

//      // Cập nhật thông tin trong modal Discount
//      document.getElementById(
//        "modal-discount-code"
//      ).innerText = `Mã giảm giá: ${discountCode}`;
//      const products = discountProducts[discountCode] || ["Không có sản phẩm"];
//      document.getElementById("modal-product-list").innerHTML = products
//        .map((product) => `<li>${product}</li>`)
//        .join("");

//      // Hiển thị overlay Discount (index 3)
//      toggleOverlayByIndex(overlays, 4);
//    });
//  });

//  // Gán sự kiện cho Super Sale
//  document
//    .querySelectorAll("#super-sale-list .view-details")
//    .forEach((item) => {
//      item.addEventListener("click", () => {
//        const saleData = superSaleData.find(
//          (data) => data.id === item.closest("tr").querySelector("td").innerText
//        );

//        if (saleData) {
//          // Cập nhật thông tin trong modal Super Sale
//          document.getElementById("sale-program-id").innerText = saleData.id;
//          document.getElementById("sale-start-date").innerText =
//            saleData.startDate;
//          document.getElementById("sale-end-date").innerText = saleData.endDate;
//          document.getElementById("sale-program-name").innerText =
//            saleData.programName;
//          document.getElementById("sale-product-list").innerHTML =
//            saleData.products.map((product) => `<li>${product}</li>`).join("");

//          // Hiển thị overlay Super Sale (index 4)
//          toggleOverlayByIndex(overlays, 5);
//        }
//      });
//    });

//  function renderCategories() {
//    const categoryList = document.getElementById("category-list");
//    categoryList.innerHTML = "";

//    // Duyệt qua cateData để hiển thị danh mục chính
//    cateData.forEach((category) => {
//      const li = document.createElement("li");

//      // Thêm danh mục chính
//      li.innerHTML = `
//          <span>${category.name}</span>
//          <ul class="subcategory-list"></ul>`;

//      // Thêm sự kiện click để hiển thị/ẩn danh mục con
//      li.addEventListener("click", () => {
//        const subcategoryList = li.querySelector(".subcategory-list");
//        subcategoryList.classList.toggle("show");
//      });

//      categoryList.appendChild(li);

//      // Tìm và thêm các loại sản phẩm thuộc danh mục này
//      const subcategoryList = li.querySelector(".subcategory-list");
//      const subcategories = subcateData.filter(
//        (sub) => sub.idCate === category.id
//      );
//      subcategories.forEach((sub) => {
//        const subLi = document.createElement("li");
//        subLi.innerHTML = `
//          <span>${sub.name}</span>
//          <button class="delete-subcategory-btn" data-id="${sub.id}">x</button>
//        `;
//        subcategoryList.appendChild(subLi);

//        // Thêm sự kiện xóa cho nút "x" của danh mục con
//        subLi
//          .querySelector(".delete-subcategory-btn")
//          .addEventListener("click", (e) => {
//            e.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài
//            const indexToRemove = subcateData.findIndex(
//              (item) => item.id === sub.id
//            );
//            if (indexToRemove > -1) {
//              subcateData.splice(indexToRemove, 1);
//              renderCategories(); // Render lại danh sách sau khi xóa
//            }
//          });
//      });
//    });
//  }

//  // Khởi tạo danh sách ban đầu
//  renderCategories();
//});

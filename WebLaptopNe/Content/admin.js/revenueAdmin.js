document.addEventListener("DOMContentLoaded", function () {
    const statisticTypeSelect = document.getElementById("statistic-type");
    const monthInputGroup = document.getElementById("month-input-group");
    const submitBtn = document.getElementById("submit-btn");
    const revenueChartCanvas = document.getElementById("revenue-chart");

    let chart;

    // Hiển thị hoặc ẩn ô nhập năm dựa vào loại thống kê
    statisticTypeSelect.addEventListener("change", function () {
        if (statisticTypeSelect.value === "monthly") {
            monthInputGroup.style.display = "flex";
        } else {
            monthInputGroup.style.display = "none";
        }
    });

    // Xử lý khi nhấn nút "Xem Thống Kê"
    submitBtn.addEventListener("click", function () {
        const statisticType = statisticTypeSelect.value;
        const year = document.getElementById("month").value;

        // Kiểm tra đầu vào
        if (statisticType === "monthly") {
            if (!year) {
                alert("Vui lòng nhập năm để xem thống kê theo tháng.");
                return;
            }
            if (isNaN(year) || year <= 0) {
                alert("Vui lòng nhập một năm hợp lệ.");
                return;
            }
        }

        // Xây dựng URL API
        const url = statisticType === "monthly"
            ? `/Admin/GetRevenueData?statisticType=${statisticType}&year=${year}`
            : `/Admin/GetRevenueData?statisticType=${statisticType}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || data.length === 0) {
                    alert("Không có dữ liệu để hiển thị.");
                    return;
                }

                // Hủy biểu đồ cũ nếu tồn tại
                if (chart) {
                    chart.destroy();
                }

                // Xử lý labels, revenues và quantities
                const labels = statisticType === "monthly"
                    ? Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
                    : data.map((item) => `Năm ${item.Year}`);
                const revenues = data.map((item) => item.Revenue || 0);
                const quantities = data.map((item) => item.Quantity || 0);

                // Tạo gradient cho đường
                const ctx = revenueChartCanvas.getContext("2d");
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "rgba(128, 0, 128, 0.5)"); // Tím nhạt
                gradient.addColorStop(1, "rgba(128, 0, 128, 0)"); // Trong suốt

                // Tạo biểu đồ
                chart = new Chart(revenueChartCanvas, {
                    type: "bar", // Biểu đồ cột là mặc định
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                type: "bar", // Biểu đồ cột cho doanh thu
                                label: "Doanh thu (VND)",
                                data: revenues,
                                backgroundColor: "rgba(64, 224, 208, 0.7)", // Màu xanh ngọc nhạt
                                borderColor: "rgba(0, 206, 209, 1)", // Màu xanh ngọc đậm
                                borderWidth: 1,
                                yAxisID: "y", // Ánh xạ với trục Y đầu tiên
                            },
                            {
                                type: "line", // Biểu đồ đường cho số lượng bán
                                label: "Số lượng bán (SP)",
                                data: quantities,
                                borderColor: "rgba(255, 105, 180, 1)", // Viền hồng đậm
                                backgroundColor: gradient, // Gradient hồng nhạt
                                borderWidth: 2,
                                fill: true, // Tô màu dưới đường
                                tension: 0.3,
                                yAxisID: "y1", // Ánh xạ với trục Y thứ hai
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: "#333",
                                },
                            },
                        },
                        scales: {
                            y: {
                                type: "linear",
                                display: true,
                                position: "left", // Trục Y đầu tiên (doanh thu)
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString("vi-VN") + " VND";
                                    },
                                },
                            },
                            y1: {
                                type: "linear",
                                display: true,
                                position: "right", // Trục Y thứ hai (số lượng bán)
                                grid: {
                                    drawOnChartArea: false, // Không vẽ lưới chồng lên trục Y đầu tiên
                                },
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString("vi-VN") + " SP"; // SP = sản phẩm
                                    },
                                },
                            },
                        },
                    },
                });
            })
            .catch((error) => {
                console.error("Error fetching revenue data:", error);
                alert("Đã xảy ra lỗi khi lấy dữ liệu thống kê.");
            });
    });
});

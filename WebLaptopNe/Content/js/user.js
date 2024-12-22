function showContent(sectionId) {
  const menuAll = document.querySelectorAll(".menu-user li");
  menuAll.forEach((item) => {
    item.classList.remove('active');
  });
  const selectedItem = Array.from(menuAll).find(item => item.getAttribute("data-section") === sectionId);
  if (selectedItem) {
    selectedItem.classList.add("active");
  }

  // Ẩn tất cả các phần nội dung
  document.querySelectorAll(".content_section").forEach((section) => {
    section.style.display = "none";
  });
  // Hiển thị phần nội dung được chọn
  document.getElementById(sectionId).style.display = "block";
}

// Hàm xử lý đăng xuất
function logout() {
  alert("Đăng xuất thành công");
  window.location.href = "login.html";
}

function luuThongTin() {
  // document.getElementById("saveMessage").style.display = "block";
}
// option cho ngày
function populateDays() {
  const daySelect = document.getElementById("day");
  daySelect.innerHTML = '<option value="date">Ngày</option>'; // Reset options
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }
}
// option cho tháng
function populateMonths() {
  const monthSelect = document.getElementById("month");
  monthSelect.innerHTML = '<option value="month">Tháng</option>'; // Reset options
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = "tháng " + i;
    monthSelect.appendChild(option);
  }
}
// option cho năm
function populateYears() {
  const yearSelect = document.getElementById("year");
  yearSelect.innerHTML = '<option value="year">Năm</option>'; // Reset options
  const currentYear = new Date().getFullYear();
  for (let i = 1920; i <= currentYear; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // Populate dropdowns on page load
  populateDays();
  populateMonths();
  populateYears();
});

// // hàm xử lí quản lí đơn hàng
const orders = []; // Change to an array with order objects to show the table.

// Function to load orders
function loadOrders() {
  const orders = [];
  const noOrdersDiv = document.getElementById("noOrders");
  const orderTableContainer = document.getElementById("orderTableContainer");
  const orderTableBody = document.getElementById("orderTableBody");
  if (orders.length === 0) {
    // hiện thị ra không có đơn hàng nào
    noOrdersDiv.style.display = "block";
    orderTableContainer.style.display = "none";
  } else {
    // hiện thị ra order table
    noOrdersDiv.style.display = "none";
    orderTableContainer.style.display = "block";
  }
  //           // Populate orders in the table
  //           orders.forEach(order => {
  //                         const row = document.createElement('tr');

  //                                     row.innerHTML =
  //                                                 <td>${order.id}</td>,

  // <td>${order.productName}</td>,
  //     <td>${order.price} VNĐ</td>,
  //     <td>${order.category}</td>,
  //     <td>${order.dateAdded}</td>,
  //     <td><a href="${order.imageUrl}" target="_blank">${order.imageUrl}</a></td>,
  //     <td>${order.productName}</td>,
  //     <td>${order.price} VNĐ</td>,
  //     <td>${order.category}</td>,
  //     <td>${order.dateAdded}</td>,
  //     <td>
  //         <button class="btn-view">Xem chi tiết</button>
  //         <button class="btn-edit">Sửa</button>
  //         <button class="btn-delete">Xóa</button>
  //     </td>;
  //      orderTableBody.appendChild(row);
  //                                               });
}
// //hàm hiển thị thông báo
// function showMessage(message, type) {
//   const messageElement = document.getElementById("message");
//   messageElement.textContent = message;
//   messageElement.style.color = type === "success" ? "green" : "red";
// }
// // hàm sử lí nút button đổi mật khẩu
// const changePasswordForm = document.getElementById("change_password_form");
// const oldPassword = document.getElementById("oldPassword").value;
// const newPassword = document.getElementById("newPassword").value;
// const confirmPassword = document.getElementById("confirm_password").value;
// changePasswordForm.addEventListener("submit", function (event) {
//   event.preventDefault();
//   // cho sẵn mật khẩu cũ trước
//   const mockCurrentPassword = "oldPassword123";
//   // kiểm tra mật khẩu nhập vào có đúng không
//   if (oldPassword !== mockCurrentPassword) {
//     showMessage("Mật khẩu không chính xác.", "error");
//     return;
//   }
//   // kiểm tra nhập lại mật khẩu mới có đúng không
//   if (newPassword !== confirmPassword) {
//     showMessage("New passwords do not match.", "error");
//     return;
//   }

//   // Password successfully changed
//   showMessage("Password changed successfully!", "success");
// });

// Mảng lưu trữ thông tin người dùng ban đầu
let userInfo = {
  username: "Nguyễn Văn A",
  gender: "male",
  phone: "0123456789",
  address: "Hà Nội",
  day: "15",
  month: "12",
  year: "1990",
};

// Hàm hiển thị thông tin người dùng ban đầu
function displayUserInfo() {
  document.getElementById("username").value = userInfo.username;
  document.getElementById("phone").value = userInfo.phone;
  document.getElementById("address").value = userInfo.address;

  // Chọn giới tính
  document.getElementById(userInfo.gender).checked = true;

  // Chọn ngày sinh
  document.getElementById("day").value = userInfo.day;
  document.getElementById("month").value = userInfo.month;
  document.getElementById("year").value = userInfo.year;
}

// Hàm cho phép chỉnh sửa thông tin
function editInfo() {
  document.getElementById("username").disabled = false;
  document.getElementById("phone").disabled = false;
  document.getElementById("address").disabled = false;
  document.getElementById("day").disabled = false;
  document.getElementById("month").disabled = false;
  document.getElementById("year").disabled = false;

  // Hiển thị các giá trị hiện tại trong các input
  displayUserInfo();
}

// Hàm lưu thông tin
function saveInfo() {
  userInfo.username = document.getElementById("username").value;
  userInfo.phone = document.getElementById("phone").value;
  userInfo.address = document.getElementById("address").value;
  userInfo.day = document.getElementById("day").value;
  userInfo.month = document.getElementById("month").value;
  userInfo.year = document.getElementById("year").value;

  alert("Thông tin đã được lưu thành công!");

  // Vô hiệu hóa các trường sau khi lưu
  document.getElementById("username").disabled = true;
  document.getElementById("phone").disabled = true;
  document.getElementById("address").disabled = true;
  document.getElementById("day").disabled = true;
  document.getElementById("month").disabled = true;
  document.getElementById("year").disabled = true;
}

// Gắn sự kiện cho các nút
document.getElementById("edit-info").addEventListener("click", editInfo);
document.getElementById("save-info").addEventListener("click", saveInfo);

// Hiển thị thông tin người dùng ban đầu khi trang được tải
window.onload = displayUserInfo;

document.addEventListener("DOMContentLoaded", async function () {
  //Lay ds tinh huyen xa
  const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json();
  };

  const provinces = await fetchData("https://provinces.open-api.vn/api/p/");
  const provinceSelect = document.getElementById("province");
  provinces.forEach((province) => {
    const option = new Option(province.name, province.code);
    provinceSelect.appendChild(option);
  });

  provinceSelect.addEventListener("change", async function () {
    const provinceCode = this.value;
    const districtSelect = document.getElementById("district");
    const wardSelect = document.getElementById("ward");

    districtSelect.innerHTML = '<option value="">Chọn Quận, Huyện</option>';
    wardSelect.innerHTML = '<option value="">Chọn Phường, Xã</option>';

    if (provinceCode) {
      const province = await fetchData(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      province.districts.forEach((district) => {
        const option = new Option(district.name, district.code);
        districtSelect.appendChild(option);
      });
    }
  });

  document
    .getElementById("district")
    .addEventListener("change", async function () {
      const districtCode = this.value;
      const wardSelect = document.getElementById("ward");
      wardSelect.innerHTML = '<option value="">Chọn Phường, Xã</option>';

      if (districtCode) {
        const district = await fetchData(
          `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        district.wards.forEach((ward) => {
          const option = new Option(ward.name, ward.code);
          wardSelect.appendChild(option);
        });
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

    const navList = document.querySelectorAll(".nav-item");
    const tabHistory = ["cart"]; 
    let canChangeTab = false; 
    const direction = document.getElementById("direction-cart")
    
    // Show tab khi có thay đổi
    function showTab(tabName) {

      document.querySelectorAll(".tab-content, .nav-item").forEach((el) => el.classList.remove("active", "highlight"));
    
      const tabContent = document.getElementById(tabName);
      if (tabContent) {
        tabContent.classList.add("active"); // Hiển thị tab hiện tại
      }
    
      const navItem = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
      if (navItem) {
        navItem.classList.add("active"); // Làm nổi bật tab hiện tại
      }
    
      // Thêm tab vào lịch sử nếu chưa có
      const tabIndex = tabHistory.indexOf(tabName);
      if (tabIndex === -1) {
        tabHistory.push(tabName);
      } else {
        tabHistory.splice(tabIndex + 1); // Xóa các tab tiếp theo nếu quay lại tab trước đó
      }
    
      // Cập nhật trạng thái các tab (hoàn thành, highlight...)
      navList.forEach((item) => {
        const itemTabName = item.getAttribute("data-tab");
        if (tabHistory.includes(itemTabName)) {
          item.classList.add("highlight", "completed");
        } else {
          item.classList.remove("highlight", "completed");
        }
      });
      if (tabName !== 'cart') {
        console.log('aa');
        direction.textContent = "Quay lại";
    }    
      console.log(tabHistory);
    }
    
    // Lắng nghe sự kiện click vào các tab
    navList.forEach((item) => {
      item.addEventListener("click", (event) => {
        const tabName = item.getAttribute("data-tab");
    
        // Chỉ cho phép chuyển đến tab nếu tab đó đã được mở trong lịch sử và là tab tiếp theo hoặc tab "cart"
        if (canChangeTab && tabHistory.includes(tabName)) {
          showTab(tabName); // Chuyển tab nếu đủ điều kiện
        } else {
          event.preventDefault(); // Ngăn chặn chuyển tab nếu chưa hoàn thành
        }
      });
    });
    
    // Mặc định hiển thị tab "cart"
    showTab("cart");
    
    // Lắng nghe sự kiện click vào nút "Mua ngay"
    const buyBtn = document.querySelectorAll(".buy-btn");
    
    buyBtn.forEach((button) => {
      button.addEventListener("click", () => {
        const currentTab = document.querySelector(".tab-content.active");
        const nextTab = currentTab?.nextElementSibling;
    
        if (currentTab?.id === "order-info") {
          const inputs = currentTab.querySelectorAll("input[required], select[required]");
          let isAllValid = true;
          const provinceSelect = document.getElementById("province");
          const districtSelect = document.getElementById("district");
          const wardSelect = document.getElementById("ward");
    
          const province = provinceSelect.options[provinceSelect.selectedIndex]?.text || "";
          const district = districtSelect.options[districtSelect.selectedIndex]?.text || "";
          const ward = wardSelect.options[wardSelect.selectedIndex]?.text || "";
    
          const fullAddress = `${document.getElementById("number-address").value}, ${ward}, ${district}, ${province}`;
    
          document.querySelector(".customer-name").textContent = document.getElementById("cus-name").value;
          document.querySelector(".customer-phone").textContent = document.getElementById("cus-tele").value;
          document.querySelector(".customer-address").textContent = fullAddress;
    
          // Kiểm tra tính hợp lệ của các input
          inputs.forEach((input) => {
            validateInput(input);
            if (!input.classList.contains("valid")) {
              isAllValid = false;
            }
          });
    
          // Chuyển tab nếu thông tin hợp lệ
          if (isAllValid && nextTab) {
            canChangeTab = true; // Cho phép chuyển tab
            showTab(nextTab.id); // Chuyển sang tab tiếp theo
          } else {
            alert("Vui lòng điền đầy đủ và hợp lệ thông tin!");
          }
        } else if (nextTab) {
          canChangeTab = true; 
          showTab(nextTab.id);
        }
      });
    });
    

  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  console.log(menuToggle, sidebar, overlay);
  menuToggle.addEventListener("click", function () {
    sidebar.classList.add("active"); 
    overlay.classList.add("active"); 
  });

  overlay.addEventListener("click", function () {
    sidebar.classList.remove("active"); 
    overlay.classList.remove("active"); 
  });

  const searchIcon = document.querySelector(".search-btn");
  const mobileSearchBar = document.getElementById("mobile-search-bar");
  const closeSearchBtn = document.getElementById("close-search-button");

  searchIcon.addEventListener("click", (event) => {
    event.preventDefault();
    mobileSearchBar.classList.add("active");
    searchIcon.style.display = "none";
  });

  closeSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mobileSearchBar.classList.remove("active");
    searchIcon.style.display = "block";
  });

  const headerUser = document.querySelector(".header-user");
  const loginBtn = document.getElementById("login-header-btn");

  // Kiểm tra sessionStorage
  const loggedInUser = sessionStorage.getItem("loggedInUser");

  if (loggedInUser) {
    headerUser.style.display = "block";
    loginBtn.style.display = "none";
  } else {
    headerUser.style.display = "none";
    loginBtn.style.display = "block";
  }

  // Code phần tăng giảm số lượng giỏ hàng
  // Lấy tất cả các nút tăng và giảm
  const increaseButtons = document.querySelectorAll(".quantity-btn.increase");
  const decreaseButtons = document.querySelectorAll(".quantity-btn.decrease");

  // Xử lý nút tăng
  increaseButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const quantityInput = event.target.parentElement.querySelector(".quantity-input");
      let currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
  });

  // Xử lý nút giảm
  decreaseButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const quantityInput = event.target.parentElement.querySelector(".quantity-input");
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  });

  // Xóa sp
  const deleteButtons = document.querySelectorAll(".delete-item");

  // Thêm sự kiện click cho từng nút "Xóa"
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Lấy thẻ <li> gần nhất chứa nút "Xóa" được nhấn
      const listItem = event.target.closest(".product-item");
      showCustomConfirm("Bạn có muốn xóa sản phẩm này", function() {
        listItem.remove(); // Xóa thẻ <li> khỏi DOM
      })
    });
  });
  const customConfirm = document.getElementById("custom-confirm");
  const confirmMessage = document.getElementById("confirm-message");
  const confirmOk = document.getElementById("confirm-ok");
  const confirmCancel = document.getElementById("confirm-cancel");
  function showCustomConfirm(message, onConfirm) {
    confirmMessage.textContent = message;
    customConfirm.classList.remove("hidden");

    // Xử lý sự kiện khi nhấn "Đồng ý"
    confirmOk.onclick = function () {
      customConfirm.classList.add("hidden");
      onConfirm();
    };

    // Xử lý sự kiện khi nhấn "Hủy"
    confirmCancel.onclick = function () {
      customConfirm.classList.add("hidden");
    };
  }
});

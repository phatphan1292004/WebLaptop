import { cateData, subcateData, productData } from "./data.js";
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const menuToggle = document.getElementById("menu-toggle");
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("overlay");
        if (menuToggle && sidebar && overlay) {
            menuToggle.addEventListener("click", function () {
                sidebar.classList.add("active"); // Hiển thị sidebar
                overlay.classList.add("active"); // Hiển thị overlay
            });

            // Đóng sidebar khi nhấn vào overlay
            overlay.addEventListener("click", function () {
                sidebar.classList.remove("active"); // Ẩn sidebar
                overlay.classList.remove("active"); // Ẩn overlay
            });
        } else {
            console.warn('Các phần tử menu-toggle, sidebar hoặc overlay không tồn tại trong DOM!');
        }

        const categoryItems = document.querySelectorAll('.cate-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                const subcategoryList = this.nextElementSibling; // Lấy danh sách con kế tiếp
                const icon = this.querySelector('i'); // Lấy phần tử icon
                
                // Toggle lớp show cho .subcategory-list
                subcategoryList.classList.toggle('show');
                
                // Toggle lớp active cho icon để xoay mũi tên
                icon.classList.toggle('active');
            });
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

        function showNotification() {
            cartNotification.classList.add('show');
        
            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                cartNotification.classList.remove('show');
            }, 3000);
        }

        let quantityProduct = 0;
        const quantityProductOrder = document.querySelector('.quantity-product');
        const buyProductBtn = document.querySelector('.buy-product');
        const cartNotification = document.getElementById('cartNotification');
        buyProductBtn.addEventListener('click', function() {
            quantityProduct++;
            quantityProductOrder.textContent = quantityProduct;
            showNotification();
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
    }, 1000);  

    
    $(document).ready(function(){
        $('.product-image-list').slick({
          infinite: true,
          slidesToShow: 1,
          prevArrow: `<button type='button' class='slick-prev slick-arrow'><i class="fa-solid fa-angle-left"></i></button>`,
          nextArrow: `<button type='button' class='slick-next slick-arrow'><i class="fa-solid fa-angle-right"></i></button>`,
        });
    });

    // Code phần rating
    const ratingItems = document.querySelectorAll(".rating-item");
  const selectedRatingDisplay = document.querySelector(".selected-rating");

  // Xử lý sự kiện hover
  ratingItems.forEach((item, index) => {
    item.addEventListener("mouseover", function() {
      // Đổi màu các sao trước sao được hover
      for (let i = 0; i <= index; i++) {
        ratingItems[i].classList.add("selected");
      }
      for (let i = index + 1; i < ratingItems.length; i++) {
        ratingItems[i].classList.remove("selected");
      }
    });

    // Xử lý sự kiện click
    item.addEventListener("click", function() {
      const ratingValue = index + 1;
      console.log("Điểm đánh giá: " + ratingValue);
      for (let i = 0; i <= index; i++) {
        ratingItems[i].classList.add("selected");
      }
    });
  });

  function renderCategoryList(cateData, subcateData) {
    const categoryList = document.querySelector(".category-list");
  
    cateData.forEach((category) => {
      // Tạo phần tử `<li>` cho danh mục chính
      const categoryItem = document.createElement("li");
      categoryItem.innerHTML = `
        <div class="cate-item">
          <p>${category.name}</p>
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <ul class="subcategory-list"></ul>
      `;
  
      // Lọc danh mục con theo `idCate`
      const subcategories = subcateData.filter(
        (subcategory) => subcategory.idCate === category.id
      );
  
      // Render danh mục con
      const subcategoryList = categoryItem.querySelector(".subcategory-list");
      subcategories.forEach((subcategory) => {
        const subcategoryItem = document.createElement("li");
  
        // Thêm thẻ <a> cho từng danh mục con
        subcategoryItem.innerHTML = `<a href="${'Detail.html' || '#'}">${subcategory.name}</a>`;
        subcategoryList.appendChild(subcategoryItem);
      });
  
      // Thêm sự kiện ẩn/hiện danh mục con khi click
      const cateHeader = categoryItem.querySelector(".cate-item");
      cateHeader.addEventListener("click", () => {
        const isVisible = subcategoryList.style.display === "block";
        subcategoryList.style.display = isVisible ? "none" : "block";
        cateHeader.querySelector("i").classList.toggle("active");
      });
  
      // Thêm danh mục chính vào danh sách
      categoryList.appendChild(categoryItem);
    });
  }
  
  // Gọi hàm render
  renderCategoryList(cateData, subcateData);
});

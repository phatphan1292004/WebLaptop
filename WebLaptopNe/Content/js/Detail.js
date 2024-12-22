import { cateData, subcateData, productData } from "./data.js";

document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra xem có phần tử .category-item > a trong DOM không
  const categoryLinks = document.querySelectorAll(".category-item > a");
  
  if (categoryLinks.length === 0) {
    console.log("Không tìm thấy các phần tử .category-item > a");
  } else {
    categoryLinks.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();

        // Đóng tất cả các sub-menu
        document.querySelectorAll(".category-item").forEach(function (el) {
          el.classList.remove("active");
        });
        
        const parent = this.parentElement;
        parent.classList.toggle("active");
      });
    });
  }
});


// Dữ liệu sản phẩm
document.addEventListener("DOMContentLoaded", function () {
  const renderProducts = (products) => {
    const container = document.getElementById("product-container");
    container.innerHTML = products
    .map((product) => {
        const originalPrice = parseInt(product.price);
        const discountPercent = parseFloat(product.discountPercent);
        const discountedPrice = originalPrice * (1 - discountPercent);
        return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="single-product-wrapper">
            <div class="product-item">
              <div class="img">
                <img src="${product.urlImage}" alt="${product.name}" />
              </div>
              <div class="product-info">
                <div class="product-name">${product.name}</div>
                <p class="original-price">${originalPrice.toLocaleString()} VND</p>
                <div class="price-discount">
                  <p class="product-price">${discountedPrice.toLocaleString()} VND</p>
                       <p class="discount-percentage">${(
                    discountPercent * 100
                  ).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
      })
      .join(""); // Ghép tất cả các phần tử thành một chuỗi HTML
  };
  
  // Gọi hàm render để hiển thị sản phẩm
  renderProducts(productData);
  
  const pageSize = 20; // Số sản phẩm mỗi trang
  let currentPage = 1;

  const renderPage = () => {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = productData.slice(start, end);
  renderProducts(pageData);

  // Hiển thị số trang
  document.getElementById("pagination-info").textContent = `Trang ${currentPage} / ${Math.ceil(productData.length / pageSize)}`;
  };

  document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
  });

  document.getElementById("next").addEventListener("click", () => {
  if (currentPage < Math.ceil(productData.length / pageSize)) {
    currentPage++;
    renderPage();
  }
  });

// Lần đầu tiên hiển thị
  renderPage();

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
        subcategoryItem.innerHTML = `<a href="${subcategory.url || '#'}">${subcategory.name}</a>`;
        subcategoryList.appendChild(subcategoryItem);
      });
  
      // Thêm sự kiện ẩn/hiện danh mục con khi click
      const cateHeader = categoryItem.querySelector(".cate-item");
      cateHeader.addEventListener("click", () => {
        subcategoryList.classList.toggle('show'); 
        cateHeader.querySelector("i").classList.toggle("active");
      });
  
      // Thêm danh mục chính vào danh sách
      categoryList.appendChild(categoryItem);
    });
  }
  
  renderCategoryList(cateData, subcateData);  
});




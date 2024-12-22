window.addEventListener("load", function () {
  // Use SlickSlider
  $(document).ready(function () {
    $(".slider-wrapper").slick({
      infinite: true,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: `<button type='button' class='slick-prev slick-arrow'><i class="fa-solid fa-angle-left"></i></button>`,
      nextArrow: `<button type='button' class='slick-next slick-arrow'><i class="fa-solid fa-angle-right"></i></button>`,
      dots: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: false,
          },
        },
      ],
    });
  });

  $(".feedback-list").slick({
    slidesToShow: 1, // Số lượng item hiển thị cùng lúc
    slidesToScroll: 1, // Số lượng item di chuyển mỗi lần cuộn
    infinite: true, // Cho phép cuộn vô hạn
    dots: true, // Hiển thị các dấu chấm chỉ mục
    arrows: true, // Hiển thị nút mũi tên
    vertical: false, // Thiết lập hiển thị ngang
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: `<button type='button' class='slick-prev slick-arrow'><i class="fa-solid fa-angle-left"></i></button>`,
    nextArrow: `<button type='button' class='slick-next slick-arrow'><i class="fa-solid fa-angle-right"></i></button>`,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: false,
          centerMode: true,
          centerPadding: "10px",
        },
      },
    ],
  });

  $(document).ready(function () {
    $(".list-product-hot").slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      prevArrow: `<button type='button' class='slick-prev slick-arrow'><i class="fa-solid fa-angle-left"></i></button>`,
      nextArrow: `<button type='button' class='slick-next slick-arrow'><i class="fa-solid fa-angle-right"></i></button>`,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 2,
            infinite: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            centerMode: true, // Bật chế độ center
            centerPadding: "10px", // Độ rộng của phần tử lòi ra
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: false,
            centerMode: true, // Bật chế độ center
            centerPadding: "10px", // Độ rộng của phần tử lòi ra
          },
        },
      ],
    });
  });

  //Load category
  cateData.forEach((category) => {
    const categoryItem = document.createElement("li");
    categoryItem.classList.add("category");

    const productsList = `
            <p class="category-header">${category.name}</p>
            <ul class="category-products">
                ${subcateData
                  .filter((subcate) => subcate.idCate === category.id)
                  .map(
                    (subcate) =>
                     `<li class="category-item"><a href="Detail.html" class="category-link">${subcate.name}</a></li>`
                  )
                  .join("")}
            </ul>
        `;
    categoryItem.innerHTML = productsList;
    document.getElementById("category-list").appendChild(categoryItem);
  });

  //LoadProduct
  // <li class="product-item">
  //     <div class="img">
  //     <img
  //       src="https://denhoamy.vn/upload/attachment/thumb/7239den-chum-tiffany-trang-tri-noi-that-dc03596-05.jpg"
  //       alt="Đèn chùm tiffany trang trí nội thất DC03596"
  //     />
  //   </div>

  //   <div class="product-info">
  //     <div class="product-name">
  //       Đèn chùm tiffany trang trí nội thất DC03596
  //     </div>

  //     <p class="original-price">3.000.000 VND</p>

  //     <div class="price-discount">
  //       <p class="product-price">2.000.000 VND</p>
  //       <p class="discount-percentage">-33%</p>
  //     </div>
  //   </div>
  // </li>

  // Lọc sản phẩm dựa trên danh mục
  function getProductsByCategory(category) {
    return productData.filter((item) => item.nameCate === category);
  }

  function renderProducts(category, index) {
    const filteredProducts = getProductsByCategory(category);

    const productList = document.getElementsByClassName("list-product")[index];
    productList.innerHTML = "";

    filteredProducts.forEach((item) => {
      const categoryItem = document.createElement("li");
      categoryItem.classList.add("product-item");

      const originalPrice = parseInt(item.price);
      const discountPercent = parseFloat(item.discountPercent);
      const discountedPrice = originalPrice * (1 - discountPercent);

      const productListHTML = `
          <div class="img">
              <img src="${item.urlImage}" alt="${item.name}" />
          </div>
  
          <div class="product-info">
              <div class="product-name">
                  ${item.name}
              </div>
  
              <p class="original-price">${originalPrice.toLocaleString()} VND</p>
  
              <div class="price-discount">
                  <p class="product-price">${discountedPrice.toLocaleString()} VND</p>
                  <p class="discount-percentage">${(
                    discountPercent * 100
                  ).toFixed(0)}%</p>
              </div>
          </div>
      `;

      categoryItem.innerHTML = productListHTML;
      productList.appendChild(categoryItem);
    });
  }

  renderProducts("Đèn chùm", 0);
  renderProducts("Đèn thả", 1);
  renderProducts("Đèn bàn", 2);
  renderProducts("Đèn ốp trần", 3);
  renderProducts("Đèn quạt", 4);
  renderProducts("Đèn khác", 5);

  // Code cho mobile

  // JavaScript to toggle the sidebar and overlay visibility
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  // Function to open sidebar
  menuToggle.addEventListener("click", function () {
    sidebar.classList.add("active"); // Show sidebar
    overlay.classList.add("active"); // Show overlay
  });

  // Function to close sidebar when overlay is clicked
  overlay.addEventListener("click", function () {
    sidebar.classList.remove("active"); // Hide sidebar
    overlay.classList.remove("active"); // Hide overlay
  });

  const searchIcon = document.querySelector(".search-btn");
  const mobileSearchBar = document.getElementById("mobile-search-bar");
  const closeSearchBtn = document.getElementById("close-search-button");

  // searchIcon.addEventListener("click", (event) => {
  //   event.preventDefault();
  //   mobileSearchBar.classList.add("active");
  //   searchIcon.style.display = "none";
  // });

  closeSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mobileSearchBar.classList.remove("active");
    searchIcon.style.display = "block";
  });

  const saleEndTime = new Date("Nov 18, 2024 00:00:00").getTime();

  // Cập nhật đồng hồ đếm ngược mỗi giây
  const countdownFunction = setInterval(function () {
    // Lấy thời gian hiện tại
    const now = new Date().getTime();

    // Tính toán thời gian còn lại
    const timeLeft = saleEndTime - now;

    // Tính số ngày, giờ, phút, giây
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Hiển thị kết quả trên trang web
    document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerHTML =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML =
      seconds < 10 ? "0" + seconds : seconds;

    // Nếu thời gian kết thúc, hiển thị thông báo
    if (timeLeft < 0) {
      clearInterval(countdownFunction);
      document.getElementById("days").innerHTML = "00";
      document.getElementById("hours").innerHTML = "00";
      document.getElementById("minutes").innerHTML = "00";
      document.getElementById("seconds").innerHTML = "00";
      alert("Sale đã kết thúc!");
    }
  }, 1000);

  // Lấy phần tử cần hiển thị hoặc ẩn
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

  // Code phần click vào sp chuyển tới trang product
  const listProductItems = document.querySelectorAll(".product-item");
  const listProductHotItems = document.querySelectorAll(".product-hot-item");
  listProductItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Chuyển hướng sang trang product.html
      window.location.href = "product.html";
    });
  });
  listProductHotItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Chuyển hướng sang trang product.html
      window.location.href = "product.html";
    });
  });

  document.getElementById('search-form').addEventListener('submit', function() {
    window.location.href = "product.html";
  });
});

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
});

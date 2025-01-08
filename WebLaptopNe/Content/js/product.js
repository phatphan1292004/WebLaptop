document.addEventListener('DOMContentLoaded', function () {


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



        $(".add-to-cart").click(function () {
            const productId = $(this).data("product-id");

            $.ajax({
                url: "/Cart/AddToCart",
                type: "POST",
                data: { productId: productId, quantity: 1 },
                success: function (response) {
                    if (response.success) {
                        Swal.fire({
                            icon: "success",
                            title: "Thành công!",
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false,
                        }).then(() => {
                            location.reload(); // Reload lại trang sau khi thông báo
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Lỗi!",
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    }
                },
                error: function () {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi hệ thống!",
                        text: "Không thể thực hiện yêu cầu. Vui lòng thử lại sau.",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
            });
        });
    });

    $(".add-to-cart").click(function () {
        const productId = $(this).data("product-id");

        $.ajax({
            url: "/Cart/AddToCart",
            type: "POST",
            data: { productId: productId, quantity: 1 },
            success: function (response) {
                if (response.success) {
                    Toastify({
                        text: response.message,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "green",
                    }).showToast();

                    setTimeout(() => location.reload(), 2000); // Reload lại trang sau khi thông báo
                } else {
                    Toastify({
                        text: response.message,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "red",
                    }).showToast();
                }
            },
            error: function () {
                Toastify({
                    text: "Không thể thực hiện yêu cầu. Vui lòng thử lại sau.",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "red",
                }).showToast();
            },
        });
    });
})



// Hàm hiển thị nội dung tab theo section
function showContent(sectionId) {
    // Ẩn tất cả các tab nội dung
    const contentSections = document.querySelectorAll(".content_section");
    contentSections.forEach((section) => {
        section.style.display = "none";
    });

    // Hiển thị tab được chọn
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = "block";
    }

    // Loại bỏ class "active" khỏi tất cả các menu
    const menuItems = document.querySelectorAll(".menu-user li");
    menuItems.forEach((item) => {
        item.classList.remove("active");
    });

    // Thêm class "active" vào mục menu được chọn
    const activeMenuItem = document.querySelector(
        `.menu-user li[data-section="${sectionId}"]`
    );
    if (activeMenuItem) {
        activeMenuItem.classList.add("active");
    }
}

// Gán sự kiện click cho từng mục menu
document.querySelectorAll(".menu-user li").forEach((menuItem) => {
    menuItem.addEventListener("click", function () {
        const sectionId = this.getAttribute("data-section");
        if (sectionId) {
            showContent(sectionId);
        }
    });
});

// Hiển thị mặc định tab đầu tiên khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    const defaultTab = document.querySelector(".menu-user li.active");
    if (defaultTab) {
        const defaultSection = defaultTab.getAttribute("data-section");
        if (defaultSection) {
            showContent(defaultSection);
        }
    }
});

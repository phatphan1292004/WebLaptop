using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;
using WebLaptopNe.Services;
using WebLaptopNe.Models.ViewModels;
using static WebLaptopNe.Services.ProductService;

namespace WebLaptopNe.Controllers
{
    public class AdminController : Controller
    {
        WebPPNeEntities1 db = new WebPPNeEntities1();
        private readonly ProductService productService;
        private readonly OrderServices orderServices;
        private readonly AccountServices accountServices;
        private readonly PromotionServices promotionServices;

        public AdminController()
        {
            productService = new ProductService(); // Tạo mới đối tượng dbContext
            orderServices = new OrderServices();
            accountServices = new AccountServices();
            promotionServices = new PromotionServices();
        }
        // GET: Admin

        public ActionResult DashboardAdmin()
        {
            // Lấy danh sách đơn hàng gần đây
            var recentOrders = db.ORDER_1
                .OrderByDescending(o => o.created_at)
                .Take(6)
                .Select(o => new RecentOrderViewModel
                {
                    CustomerId = o.user_id,
                    CustomerName = o.user.cus_name,
                    OrderDate = o.created_at,
                    Status = o.order_status
                })
                .ToList();

            // Lấy danh sách Top 5 sản phẩm bán chạy
            var topProducts = db.order_details
                .GroupBy(od => new { od.product_id, od.product.product_name, od.product.product_detail.stock_quantity })
                .Select(group => new TopProductViewModel
                {
                    ProductName = group.Key.product_name,
                    TotalSold = group.Sum(od => od.quantity),
                    TotalRevenue = group.Sum(od => od.quantity * od.unit_price),
                    StockQuantity = group.Key.stock_quantity
                })
                .OrderByDescending(p => p.TotalSold)
                .Take(5)
                .ToList();

            // Tạo ViewModel và gán dữ liệu
            var dashboardViewModel = new DashboardViewModel
            {
                RecentOrders = recentOrders,
                TopProducts = topProducts
            };

            return View(dashboardViewModel); // Truyền ViewModel tới View
        }



        public ActionResult ProductAdmin()
        {
            // Lấy danh sách danh mục
            var categories = db.categories.ToList();

            // Lấy danh sách thương hiệu
            var brands = db.brands.ToList();

            // Truyền dữ liệu qua ViewBag
            ViewBag.Categories = categories;
            ViewBag.Brands = brands;

            return View();
        }


        public ActionResult OrderAdmin()
        {
            return View();
        }

        public ActionResult CusAdmin()
        {
            return View();
        }

        public class PromotionViewModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        public ActionResult PromotionAdmin()
        {
            var promotions = db.promotions.ToList();

            ViewBag.Promotions = promotions;
            return View();
        }



        public ActionResult AccountAdmin()
        {
            return View();
        }

        public ActionResult RevenueAdmin()
        {
            return View();
        }




        //====================TRANG SẢN PHẨM===========================
        [HttpPost]
        public JsonResult DeleteProduct(int productId)
        {
            return productService.DeleteProduct(productId); // Gọi phương thức từ Service
        }

        // Lấy danh sách sản phẩm
        public JsonResult GetProducts(string searchValue)
        {
            return productService.GetProducts(searchValue); // Gọi phương thức từ Service
        }

        public JsonResult GetProductDetails(int productId)
        {
            return productService.GetProductDetails(productId); // Gọi phương thức từ Service
        }


        //==================TRANG ĐƠN HÀNG ==============================
        public JsonResult GetOrders(string searchValue, string status)
        {
            return orderServices.GetOrders(searchValue, status); // Gọi phương thức từ Service
        }

        public JsonResult GetOrderDetails(int orderId)
        {
            var order = orderServices.GetOrderDetails(orderId);
            if (order == null)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }

            return Json(order, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult ApproveOrder(int orderId)
        {
            var success = orderServices.ApproveOrder(orderId);
            if (!success)
            {
                return Json(new { success = false, message = "Order not found" });
            }

            return Json(new { success = true, message = "Order approved successfully" });
        }

        // API từ chối đơn hàng
        [HttpPost]
        public JsonResult RejectOrder(int orderId)
        {
            var success = orderServices.RejectOrder(orderId);
            if (!success)
            {
                return Json(new { success = false, message = "Order not found" });
            }

            return Json(new { success = true, message = "Order rejected successfully" });
        }

        //=======================Account===============================
        public JsonResult GetAccount(string searchValue)
        {
            return accountServices.GetAccounts(searchValue); // Gọi phương thức từ Service
        }

        public JsonResult AddAccount(user model, string confirm_password)
        {
            return accountServices.AddAccount(model, confirm_password);
        }

        public JsonResult DeleteAccount(int userId)
        {
           return accountServices.DeleteAccount(userId);
        }

        // Action để xóa tài khoản
        // Action để xem chi tiết tài khoản
        [HttpGet]
        public JsonResult GetAccountById(int userId)
        {
            return accountServices.GetAccountById(userId);
        }

        // Action để cập nhật tài khoản
        [HttpPost]
        public JsonResult UpdateAccount(user model)
        {
            return accountServices.UpdateAccount(model);
        }

        [HttpPost]
        public JsonResult AddProduct(ProductViewModel model, IEnumerable<HttpPostedFileBase> uploadedImages)
        {
            try
            {
                var result = productService.AddProductWithImages(model, uploadedImages);
                return result;
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Lỗi: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        //====================TRANG KHUYẾN MÃI===========================
        public JsonResult GetPromotions(string searchValue)
        {
            return promotionServices.GetPromotions(searchValue);
        }

        public JsonResult GetPromotionById(int promotionId)
        {
            return promotionServices.GetPromotionById(promotionId);
        }

        [HttpPost]
        public JsonResult AddPromotion(promotion model)
        {
            try
            {
                return promotionServices.AddPromotion(model);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdatePromotion(promotion model)
        {
            try
            {
                return promotionServices.UpdatePromotion(model);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DeletePromotion(int promotionId)
        {
            try
            {
                return promotionServices.DeletePromotion(promotionId);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Lỗi: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AddProductToPromotion(int promotionId, int productId)
        {
            // Gọi service để xử lý logic
            return promotionServices.AddProductToPromotion(promotionId, productId);
        }

        [HttpGet]
        public JsonResult GetProductsByPromotion(int promotionId)
        {
            return promotionServices.GetProductsByPromotion(promotionId);
        }

        [HttpPost]
        public JsonResult RemoveProductFromPromotion(int promotionId, int productId)
        {
            // Gọi Service để xử lý logic xóa sản phẩm
            return promotionServices.RemoveProductFromPromotion(promotionId, productId);
        }

        [HttpPost]
        public JsonResult RemovePromotion(int promotionId)
        {
            // Gọi service để xử lý logic xóa chương trình
            return promotionServices.RemovePromotion(promotionId);
        }
    }
}
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
            var customerTypeDistribution = db.ORDER_1
                .GroupBy(o => o.user_id)
                .Select(group => new
                {
                    CustomerId = group.Key,
                    OrderCount = group.Count()
                })
                .GroupBy(c =>
                    c.OrderCount > 10 ? "VIP" :
                    c.OrderCount >= 5 ? "Thường xuyên" : "Mới")
                .Select(g => new
                {
                    CustomerType = g.Key,
                    Count = g.Count()
                })
                .ToList();

            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var totalRevenue = db.ORDER_1
                .Where(o => o.created_at.Month == currentMonth && o.created_at.Year == currentYear)
                .Sum(o => (decimal?)o.total_price) ?? 0;

            var totalCustomers = db.users
                .Count();

            var totalOrders = db.ORDER_1
                .Where(o => o.created_at.Month == currentMonth && o.created_at.Year == currentYear)
                .Count();
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
                TotalRevenue = totalRevenue,
                TotalCustomers = totalCustomers,
                TotalOrders = totalOrders,
                RecentOrders = recentOrders,
                TopProducts = topProducts,
                CustomerTypeDistribution = customerTypeDistribution.Select(ct => new CustomerTypeViewModel
                 {
                     Type = ct.CustomerType,
                     Count = ct.Count
                 }).ToList()
            };

            return View(dashboardViewModel); // Truyền ViewModel tới View
        }



        [HttpGet]
        public JsonResult GetProductStats()
        {
            // Tổng số lượng sản phẩm trong kho
            var totalStock = db.products.Sum(p => p.product_detail.stock_quantity);

            // Số loại sản phẩm
            var totalCategories = db.categories.Count();

            // Số sản phẩm hết hàng
            var outOfStock = db.products.Count(p => p.product_detail.stock_quantity == 0);

            // Sản phẩm mới nhất (dựa trên ngày thêm vào)
            var latestProduct = db.products
                .OrderByDescending(p => p.created_at)
                .Select(p => new
                {
                    p.product_name,
                    p.created_at
                })
                .FirstOrDefault();

            return Json(new
            {
                TotalStock = totalStock,
                TotalCategories = totalCategories,
                OutOfStock = outOfStock,
                LatestProduct = latestProduct?.product_name ?? "Chưa có"
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetCustomerStats()
        {
            var users = db.users.ToList(); // Tải tất cả người dùng từ cơ sở dữ liệu

            // Tổng khách hàng trong tháng này
            var totalCustomersInMonth = users.Count(u => u.created_at.Month == DateTime.Now.Month && u.created_at.Year == DateTime.Now.Year);

            // Khách hàng mới hôm nay
            var newCustomersToday = users.Count(u => u.created_at.Date == DateTime.Today);

            // Khách hàng thường xuyên (giả sử có thuộc tính purchase_count)
            var regularCustomers = users.Count(u => u.ORDER_1.Count() >= 5);

            // Phản hồi từ khách hàng (giả sử có bảng feedbacks)
            var customerFeedbackCount = db.reviews.Count();

            return Json(new
            {
                MonthlyTotalCustomers = totalCustomersInMonth,
                NewCustomersToday = newCustomersToday,
                RegularCustomers = regularCustomers,
                CustomerFeedbackCount = customerFeedbackCount
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetOrderStats()
        {
            // Tổng đơn hàng
            var totalOrders = db.ORDER_1.Count();

            // Đơn hàng chưa xử lý (Giả sử "Pending" là trạng thái chưa xử lý)
            var pendingOrders = db.ORDER_1.Count(o => o.order_status == "Pending");

            // Đơn hàng đang giao (Giả sử "In Transit" là trạng thái đang giao)
            var inTransitOrders = db.ORDER_1.Count(o => o.order_status == "In Transit");

            return Json(new
            {
                TotalOrders = totalOrders,
                PendingOrders = pendingOrders,
                InTransitOrders = inTransitOrders
            }, JsonRequestBehavior.AllowGet);
        }

       


        //[HttpPost]
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


        [HttpGet]
        public JsonResult GetCustomerList()
        {
            // Tải dữ liệu vào bộ nhớ trước bằng ToList()
            var customers = db.users
                .ToList() // Tải dữ liệu từ database vào bộ nhớ
                .Select(user => new
                {
                    user.id,
                    user.cus_name,
                    user.email,
                    user.phone,
                    user.address,
                    CreatedAt = user.created_at.ToString("dd/MM/yyyy") // Chuyển đổi ngày trong bộ nhớ
                })
                .ToList();

            return Json(customers, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetPurchaseHistory(int customerId)
        {
            var purchaseHistory = db.ORDER_1
                .Where(order => order.user_id == customerId)
                .Select(order => new
                {
                    order.id,
                    order.created_at,
                    order.total_price,
                    order.order_status
                })
                .ToList();

            return Json(purchaseHistory, JsonRequestBehavior.AllowGet);
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

        [HttpGet]
        public JsonResult GetRevenueData(string statisticType, int? year = null)
        {
            try
            {
                if (statisticType == "yearly")
                {
                    // Lấy năm hiện tại
                    var currentYear = DateTime.Now.Year;

                    // Tạo danh sách các năm từ currentYear - 4 đến currentYear
                    var years = Enumerable.Range(currentYear - 4, 5).ToList();

                    // Ghép dữ liệu từ bảng ORDER_1 và order_details với danh sách năm
                    var revenueByYear = years
                        .GroupJoin(
                            db.ORDER_1.Join(
                                db.order_details, // Thực hiện join giữa ORDER_1 và order_details
                                order => order.id, // Khóa chính từ ORDER_1
                                detail => detail.order_id, // Khóa ngoại từ order_details
                                (order, detail) => new
                                {
                                    Year = order.created_at.Year,
                                    Revenue = order.total_price,
                                    Quantity = detail.quantity
                                }
                            ),
                            groupYear => groupYear, // Năm từ danh sách
                            order => order.Year, // Năm từ dữ liệu
                            (groupYear, orders) => new
                            {
                                Year = groupYear, // Năm
                                Revenue = orders.Sum(o => (decimal?)o.Revenue) ?? 0, // Tổng doanh thu (hoặc 0 nếu không có đơn hàng)
                                Quantity = orders.Sum(o => (int?)o.Quantity) ?? 0 // Tổng số lượng bán (hoặc 0 nếu không có đơn hàng)
                            }
                        )
                        .OrderByDescending(x => x.Year) // Sắp xếp giảm dần theo năm
                        .ToList();

                    return Json(revenueByYear, JsonRequestBehavior.AllowGet);
                }


                if (statisticType == "monthly" && year.HasValue)
                {
                    // Lấy dữ liệu doanh thu và số lượng bán theo tháng (12 tháng của năm được chọn)
                    var revenueByMonth = Enumerable.Range(1, 12) // Tạo danh sách từ tháng 1 đến tháng 12
                        .GroupJoin(
                            db.ORDER_1.Join(
                                db.order_details, // Thực hiện join giữa ORDER_1 và order_details
                                order => order.id, // Khóa chính từ ORDER_1
                                detail => detail.order_id, // Khóa ngoại từ order_details
                                (order, detail) => new
                                {
                                    Year = order.created_at.Year,
                                    Month = order.created_at.Month,
                                    Revenue = order.total_price,
                                    Quantity = detail.quantity
                                }
                            ).Where(o => o.Year == year.Value), // Lọc theo năm
                            month => month, // Tháng từ 1 -> 12
                            order => order.Month, // Tháng từ dữ liệu
                            (month, orders) => new
                            {
                                Month = month, // Tháng
                                Revenue = orders.Sum(o => (decimal?)o.Revenue) ?? 0, // Tổng doanh thu hoặc 0 nếu không có dữ liệu
                                Quantity = orders.Sum(o => (int?)o.Quantity) ?? 0 // Tổng số lượng bán hoặc 0 nếu không có dữ liệu
                            }
                        )
                        .OrderBy(x => x.Month) // Sắp xếp theo tháng
                        .ToList();

                    return Json(revenueByMonth, JsonRequestBehavior.AllowGet);
                }


                return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
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
        [HttpGet]
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




        //Update Product
        [HttpPost]
        public JsonResult UpdateProduct(ProductViewModel model)
        {
            try
            {
                var product = db.products.FirstOrDefault(p => p.id == model.ProductId);
                if (product == null)
                {
                    return Json(new { success = false, message = "Sản phẩm không tồn tại." });
                }

                // Cập nhật các thuộc tính sản phẩm
                product.product_name = model.ProductName;
                product.unit_price = model.UnitPrice;
                product.product_status = model.ProductStatus;
                product.discount_percent = model.DiscountPercent;
                product.product_detail.cpu = model.CPU;
                product.product_detail.gpu = model.GPU;
                product.product_detail.ram = model.RAM;
                product.product_detail.storage = model.Storage;
                product.product_detail.screen_size = model.ScreenSize;
                product.product_detail.webcam = model.Webcam;
                product.product_detail.os = model.OS;
                product.product_detail.weight = model.Weight;
                product.product_detail.stock_quantity = model.StockQuantity;
                product.product_detail.warranty_period = model.WarrantyPeriod;

                db.SaveChanges();

                return Json(new { success = true, message = "Cập nhật sản phẩm thành công." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Đã xảy ra lỗi: {ex.Message}" });
            }
        }

    }
}
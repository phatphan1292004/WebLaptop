using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;
using WebLaptopNe.Models.ViewModels;

namespace WebLaptopNe.Controllers
{
    public class HomeController : Controller
    {
        WebPPNeEntities1 db = new WebPPNeEntities1();

        // GET: Home
        public ActionResult Index()
        {
            // Lấy danh sách sản phẩm và hình ảnh
            var productList = db.products.ToList();
            var productImages = db.product_images.ToList();

            // Lấy danh sách chương trình khuyến mãi
            var promotions = db.promotions
                .Where(promo => db.promotion_programs.Any(pp => pp.promotion_id == promo.id && pp.product_id != null)) // Chỉ lấy promotions có sản phẩm liên kết
                .Select(promo => new PromotionViewModel
                {
                    PromotionName = promo.promotion_name,
                    StartDate = promo.start_day,
                    EndDate = promo.end_day,
                    Products = (from pp in db.promotion_programs
                                join product in db.products on pp.product_id equals product.id
                                where pp.promotion_id == promo.id && pp.product_id != null // Đảm bảo product_id không null
                                select new PromotionProductViewModel
                                {
                                    ProductId = product.id,
                                    ProductName = product.product_name,
                                    UnitPrice = product.unit_price,
                                    DiscountPercent = ((product.discount_percent) + (promo.discount_percent ?? 0)),
                                    DiscountPrice = product.unit_price * (1 - (((product.discount_percent) + (promo.discount_percent ?? 0)) / 100m)),                                    // Tính giá sau giảm gộp
                                    ProductImage = (db.product_images.FirstOrDefault(pi => pi.product_id == product.id && pi.main_image) != null)
                                        ? db.product_images.FirstOrDefault(pi => pi.product_id == product.id && pi.main_image).url
                                        : "/Content/img/default-product-image.jpg"
                                }).ToList()
                }).ToList();


            // Tạo ViewModel và truyền dữ liệu
            var viewModel = new HomePageViewModel
            {
                Products = productList,
                ProductImages = productImages,
                Promotions = promotions
            };

            return View(viewModel);
        }



        [HttpPost]
        public JsonResult SubmitReview(review model)
        {
            if (Session["userInfo"] == null)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để thực hiện đánh giá!" });
            }

            // Lấy thông tin user từ Session
            var user = (user)Session["userInfo"];
            int userId = user.id;

            // Kiểm tra dữ liệu đầu vào
            if (model == null || string.IsNullOrWhiteSpace(model.content))
            {
                return Json(new { success = false, message = "Dữ liệu không hợp lệ!" });
            }

            // Tạo đối tượng review mới
            var review = new review
            {
                product_id = model.product_id,
                user_id = userId,
                content = model.content,
                rating = model.rating,
                review_typpe = "Sản phẩm", // Loại đánh giá
            };

            // Lưu vào cơ sở dữ liệu
            db.reviews.Add(review);
            db.SaveChanges();

            return Json(new { success = true, message = "Đánh giá của bạn đã được lưu!" });
        }

        public JsonResult GetReviews(int productId)
        {
            var reviews = db.reviews
                .Where(r => r.product_id == productId)
                .OrderByDescending(r => r.id)
                .Select(r => new
                {
                    Username = r.user.username,
                    Content = r.content,
                    Rating = r.rating,
                }).ToList();

            return Json(reviews, JsonRequestBehavior.AllowGet);
        }


        public ActionResult ProductDetail(int id)
        {
            var productDetail = db.product_detail.FirstOrDefault(p => p.product_id == id);
            // Lấy hình ảnh chính
            var mainImage = db.product_images.FirstOrDefault(pi => pi.product_id == id && pi.main_image);
            var listImgs = db.product_images
                  .Where(pi => pi.product_id == id) // Loại trừ hình chính
                  .Select(pi => pi.url)
                  .ToList();


            // Truyền dữ liệu sang View
            ViewBag.MainImage = mainImage?.url; // Truyền URL của hình chính
            var additionalImages = db.product_images
                             .Where(pi => pi.product_id == id) 
                             .Select(pi => pi.url) 
                             .ToList();
            ViewBag.AdditionalImages = additionalImages;
            ViewBag.ListImg = listImgs;
            return View(productDetail);
        }

        public ActionResult Category(int? categoryId, int? brandId, decimal? minPrice, decimal? maxPrice, string sortBy)
        {
            // Lấy danh sách sản phẩm
            var products = db.products.AsQueryable();

            // Lọc theo danh mục
            if (categoryId.HasValue)
            {
                var category = db.categories.FirstOrDefault(c => c.id == categoryId.Value);
                ViewBag.Category = category?.category_name;
                products = products.Where(p => p.category_id == categoryId.Value);
            }

            // Lọc theo thương hiệu
            if (brandId.HasValue)
            {
                var brand = db.brands.FirstOrDefault(b => b.brand_id == brandId.Value);
                ViewBag.Brand = brand?.brand_name;
                products = products.Where(p => p.brand_id == brandId.Value);
            }

            // Lọc theo khoảng giá
            if (minPrice.HasValue)
            {
                products = products.Where(p => p.unit_price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                products = products.Where(p => p.unit_price <= maxPrice.Value);
            }

            // Sắp xếp
            switch (sortBy)
            {
                case "price-asc":
                    products = products.OrderBy(p => p.unit_price);
                    break;
                case "price-desc":
                    products = products.OrderByDescending(p => p.unit_price);
                    break;
                case "name-asc":
                    products = products.OrderBy(p => p.product_name);
                    break;
                case "name-desc":
                    products = products.OrderByDescending(p => p.product_name);
                    break;
                default:
                    products = products.OrderBy(p => p.product_name); // Mặc định sắp xếp theo tên
                    break;
            }

            // Lấy hình ảnh sản phẩm
            var productImages = db.product_images.ToList();
            ViewBag.productImages = productImages;

            return View(products.ToList());
        }

        [HttpGet]
        public JsonResult GetOrderHistory()
        {
            // Lấy thông tin người dùng từ session
            var username = Session["username"].ToString();
            var user = db.users.FirstOrDefault(u => u.username == username);

            if (user == null)
            {
                return Json(new { errorMessage = "Không tìm thấy người dùng." }, JsonRequestBehavior.AllowGet);
            }

            // Lấy danh sách đơn hàng của người dùng, chỉ lấy thông tin cần thiết
            var orders = db.ORDER_1.Where(o => o.user_id == user.id)
                                  .Select(o => new
                                  {
                                      o.id,
                                      o.created_at,
                                      o.total_price,
                                      o.order_status
                                  }).ToList();

            return Json(orders, JsonRequestBehavior.AllowGet);
        }


        public ActionResult User()
        {
            var userInfo = Session["userInfo"] as user; // Lấy thông tin người dùng từ Session

            if (userInfo == null)
            {
                return RedirectToAction("Login", "Home"); // Nếu chưa đăng nhập, chuyển hướng đến Login
            }

            return View(userInfo); // Truyền userInfo sang view
        }




        public ActionResult CategoryHeader()
        {
            var data = db.categories.ToList();
            return PartialView(data);
        }


        [HttpGet]
        public ActionResult Search(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                ViewBag.Message = "Vui lòng nhập từ khóa tìm kiếm.";
                return View(new List<product>()); // Trả về danh sách rỗng nếu không có từ khóa
            }

            // Tìm kiếm trong cơ sở dữ liệu
            var productImages = db.product_images.ToList();
            var results = db.products
                            .Where(p => p.product_name.Contains(query))
                            .ToList();

            ViewBag.Query = query; // Truyền từ khóa để hiển thị trong View
            ViewBag.productImages = productImages;
            return View(results); // Truyền danh sách sản phẩm tìm được sang View
        }
    }
}
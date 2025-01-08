using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;

namespace WebLaptopNe.Controllers
{
    public class HomeController : Controller
    {
        WebPPEntities2 db = new WebPPEntities2();

        // GET: Home
        public ActionResult Index()
        {
            var productList = db.products.ToList();
            var productImages = db.product_images.ToList();
          


            ViewBag.listSPHome = productList;
            ViewBag.productImages = productImages;

            return View(productList);
        }


        public ActionResult ProductDetail(int id)
        {
            var productDetail = db.product_detail.FirstOrDefault(p => p.product_id == id);
            // Lấy hình ảnh chính
            var mainImage = db.product_images.FirstOrDefault(pi => pi.product_id == id && pi.main_image);

            // Truyền dữ liệu sang View
            ViewBag.MainImage = mainImage?.url; // Truyền URL của hình chính
            var additionalImages = db.product_images
                             .Where(pi => pi.product_id == id) 
                             .Select(pi => pi.url) 
                             .ToList();
            ViewBag.AdditionalImages = additionalImages;
            return View(productDetail);
        }

        public ActionResult Category(int? categoryId, int? brandId)
        {
            IEnumerable<product> products;

            if (brandId.HasValue)
            {
                // Lấy sản phẩm theo brand
                var brand = db.brands.FirstOrDefault(b => b.brand_id == brandId.Value);
                var category = db.categories.FirstOrDefault(c => c.id == brand.category_id);
                ViewBag.Category = category?.category_name; 
                ViewBag.Brand = brand?.brand_name; 
                products = db.products.Where(p => p.brand_id == brandId.Value).ToList();
            }
            else if (categoryId.HasValue)
            {
                // Lấy sản phẩm theo category
                var category = db.categories.FirstOrDefault(c => c.id == categoryId.Value);
                ViewBag.Category = category?.category_name;
                products = db.products.Where(p => p.category_id == categoryId.Value).ToList();
            }
            else
            {
                ViewBag.Breadcrumb = "Trang chủ";
                products = new List<product>();
            }

            var productImages = db.product_images.ToList();
            ViewBag.productImages = productImages;

            return View(products);
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
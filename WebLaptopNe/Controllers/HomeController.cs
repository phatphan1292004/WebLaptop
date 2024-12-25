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
        WebPPEntities db = new WebPPEntities();

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

            return View(productDetail);
        }

        public ActionResult Category()
        {
            return View();
        }

        public ActionResult Cart()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult User()
        {
            return View();
        }
    }
}
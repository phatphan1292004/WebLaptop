using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLaptopNe.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult DashboardAdmin()
        {
            return View();
        }

        public ActionResult ProductAdmin()
        {
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
        public ActionResult PromotionAdmin()
        {
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
    }
}
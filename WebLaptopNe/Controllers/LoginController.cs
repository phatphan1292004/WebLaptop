using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;

namespace WebLaptopNe.Controllers
{
    public class LoginController : Controller
    {
        WebPPEntities2 db = new WebPPEntities2();
        // GET: Login
        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Register(user model, string rePassword)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (model.password != rePassword)
            {
                ViewBag.ErrorMessage = "Mật khẩu nhập lại không khớp.";
                return View(model);
            }

            var existingUser = db.users.FirstOrDefault(u => u.username == model.username || u.email == model.email);
            if (existingUser != null)
            {
                ViewBag.ErrorMessage = "Username hoặc Email đã tồn tại.";
                return View(model);
            }

            try
            {
                model.password = HashPassword(model.password);
                model.created_at = DateTime.Now;
                model.role = "user";

                db.users.Add(model);
                db.SaveChanges();

                ViewBag.SuccessMessage = "Đăng ký thành công!";
                return RedirectToAction("Login");
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                foreach (var validationError in ex.EntityValidationErrors)
                {
                    foreach (var error in validationError.ValidationErrors)
                    {
                        ViewBag.ErrorMessage += $"{error.PropertyName}: {error.ErrorMessage}<br/>";
                    }
                }
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Đã xảy ra lỗi trong quá trình đăng ký. Chi tiết lỗi: " + ex.Message;
            }

            return View(model);
        }



        [HttpPost]
        public ActionResult Login(user model)
        {
            if (string.IsNullOrWhiteSpace(model.username) || string.IsNullOrWhiteSpace(model.password))
            {
                ViewBag.ErrorMessage = "Vui lòng nhập đầy đủ thông tin.";
                return View(model);
            }

            // Kiểm tra xem username có tồn tại không
            var existingUser = db.users.FirstOrDefault(u => u.username == model.username);
            if (existingUser == null)
            {
                ViewBag.ErrorMessage = "Tài khoản không tồn tại.";
                return View(model);
            }

            // So sánh mật khẩu đã hash
            string hashedPassword = HashPassword(model.password);
            if (hashedPassword != existingUser.password)
            {
                ViewBag.ErrorMessage = "Mật khẩu không chính xác.";
                return View(model);
            }

            // Đăng nhập thành công
            Session["username"] = existingUser.username;
            Session["role"] = existingUser.role;
            Session["userInfo"] = existingUser;
            ViewBag.SuccessMessage = "Đăng nhập thành công!";
            return RedirectToAction("Index", "Home");
        }




        // Hash mật khẩu
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;
using System.Configuration;
using static System.Net.WebRequestMethods;
using System.Web.UI.WebControls;

namespace WebLaptopNe.Controllers
{
    public class LoginController : Controller
    {
        WebPPNeEntities1 db = new WebPPNeEntities1();
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

        [HttpPost]
        public ActionResult ForgotPassword(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                ViewBag.ErrorMessage = "Vui lòng nhập email.";
                return View("Login");
            }

            // Kiểm tra email có tồn tại trong hệ thống không
            var user = db.users.FirstOrDefault(u => u.email == email);
            if (user == null)
            {
                ViewBag.ErrorMessage = "Email không tồn tại trong hệ thống.";
                return View("Login");
            }

            try
            {
                // Tạo mật khẩu mới
                string newPassword = GenerateRandomPassword();
                string hashedPassword = HashPassword(newPassword);

                // Cập nhật mật khẩu mới trong cơ sở dữ liệu
                user.password = hashedPassword;
                db.SaveChanges();

                // Gửi email chứa mật khẩu mới
                SendPasswordEmail(email, newPassword);

                ViewBag.SuccessMessage = "Mật khẩu mới đã được gửi đến email của bạn.";
                return View("Login");
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Đã xảy ra lỗi khi xử lý yêu cầu: " + ex.Message;
                return View("Login");
            }
        }

        // Hàm tạo mật khẩu ngẫu nhiên
        private string GenerateRandomPassword(int length = 8)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
            {
                byte[] uintBuffer = new byte[sizeof(uint)];
                while (res.Length < length)
                {
                    rng.GetBytes(uintBuffer);
                    uint num = BitConverter.ToUInt32(uintBuffer, 0);
                    res.Append(validChars[(int)(num % (uint)validChars.Length)]);
                }
            }
            return res.ToString();
        }

        private void SendPasswordEmail(string toEmail, string newPassword)
        {
            try
            {
                // Khởi tạo đối tượng SmtpClient
                using (var smtpClient = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtpClient.Credentials = new NetworkCredential("ryanz1292004@gmail.com", "xfpg rywy kemf yfde");
                    smtpClient.EnableSsl = true; // Bật SSL để bảo mật

                    // Tạo nội dung email
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("ryanz1292004@gmail.com"), // Địa chỉ email gửi
                        Subject = "Cấp lại mật khẩu.",
                        Body = $"Mật khẩu mới của bạn là (Hãy đăng nhập để đổi lại mật khẩu): {newPassword}", // Sử dụng newPassword thay vì otpCode
                        IsBodyHtml = true,
                    };

                    // Thêm địa chỉ email người nhận
                    mailMessage.To.Add(toEmail);

                    // Gửi email
                    smtpClient.Send(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Ghi thông báo lỗi nếu gửi email thất bại
                TempData["ErrorMessage"] = $"Gửi email thất bại tới: {toEmail}. Lỗi: {ex.Message}";
            }
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
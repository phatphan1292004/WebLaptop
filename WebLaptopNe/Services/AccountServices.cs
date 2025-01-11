using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;

namespace WebLaptopNe.Services
{
    public class AccountServices
    {
        WebPPNeEntities1 db = new WebPPNeEntities1();

        public JsonResult GetAccounts(string searchValue)
        {
            var accounts = (from u in db.users
                            where string.IsNullOrEmpty(searchValue) || u.username.Contains(searchValue) || u.cus_name.Contains(searchValue)
                            select new
                            {
                                UserId = u.id,
                                Username = u.username,
                                Email = u.email,
                                CreatedAt = u.created_at,
                                Role = u.role
                            }).ToList();

            return new JsonResult { Data = accounts, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        public JsonResult AddAccount(user model, string confirm_password)
        {
            var existingUser = db.users.FirstOrDefault(u => u.username == model.username || u.email == model.email);
            if (existingUser != null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Username hoặc Email đã tồn tại." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            // Kiểm tra mật khẩu và xác nhận mật khẩu khớp nhau
            if (model.password != confirm_password)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Mật khẩu không khớp." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            try
            {
                // Mã hóa mật khẩu
                model.password = HashPassword(model.password);
                model.created_at = DateTime.Now;

                // Thêm người dùng vào cơ sở dữ liệu
                db.users.Add(model);
                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Đăng ký thành công!" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException ex)
            {
                var validationErrors = ex.EntityValidationErrors
                    .SelectMany(e => e.ValidationErrors)
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}")
                    .ToList();

                // Trả về chi tiết lỗi xác thực
                return new JsonResult
                {
                    Data = new { success = false, message = "Lỗi xác thực dữ liệu.", errors = validationErrors },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = $"Đã xảy ra lỗi trong quá trình đăng ký. Chi tiết lỗi: {ex.Message}" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }


        // Phương thức HashPassword để mã hóa mật khẩu
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

        [HttpPost]
        public JsonResult DeleteAccount(int userId)
        {
            try
            {
                // Tìm người dùng theo userId
                var user = db.users.FirstOrDefault(u => u.id == userId);
                if (user == null)
                {
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Không tìm thấy tài khoản." },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }

                // Xóa người dùng
                db.users.Remove(user);
                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Xóa tài khoản thành công!" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = $"Đã xảy ra lỗi: {ex.Message}" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }

        // Phương thức lấy thông tin chi tiết của tài khoản theo UserId
        public JsonResult GetAccountById(int userId)
        {
            var user = db.users
                .Where(u => u.id == userId)
                .Select(u => new
                {
                    UserId = u.id,
                    Username = u.username,
                    Email = u.email,
                    Phone = u.phone,
                    Address = u.address,
                    CreatedAt = u.created_at,
                    Role = u.role,
                    CusName = u.cus_name
                })
                .FirstOrDefault();

            if (user == null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Không tìm thấy tài khoản." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            return new JsonResult
            {
                Data = user,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        // Phương thức cập nhật tài khoản
        [HttpPost]
        public JsonResult UpdateAccount(user model)
        {
            var existingUser = db.users.FirstOrDefault(u => u.id == model.id);
            if (existingUser == null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Không tìm thấy tài khoản để cập nhật." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            try
            {
                // Cập nhật thông tin người dùng
                existingUser.email = model.email;
                existingUser.role = model.role;
                existingUser.cus_name = model.cus_name;
                existingUser.phone = model.phone;
                existingUser.address = model.address;

                // Kiểm tra trạng thái của đối tượng trước khi lưu
                Console.WriteLine(db.Entry(existingUser).State); // Kiểm tra trạng thái

                db.SaveChanges();

                // Kiểm tra lại trạng thái sau khi lưu
                Console.WriteLine(db.Entry(existingUser).State); // Kiểm tra trạng thái sau khi lưu

                return new JsonResult
                {
                    Data = new { success = true, message = "Cập nhật tài khoản thành công!" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = $"Đã xảy ra lỗi trong quá trình cập nhật. Chi tiết lỗi: {ex.Message}" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }
    }
}
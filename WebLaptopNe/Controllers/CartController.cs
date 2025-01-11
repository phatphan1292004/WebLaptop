using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;
using static WebLaptopNe.Controllers.CartController;

namespace WebLaptopNe.Controllers
{
    public class CartController : Controller
    {

        WebPPNeEntities1 db = new WebPPNeEntities1();

        public class CartItem
        {
            public int ProductId { get; set; }         // ID sản phẩm
            public string ProductName { get; set; }   // Tên sản phẩm
            public decimal UnitPrice { get; set; }    // Đơn giá
            public int Quantity { get; set; }         // Số lượng
            public decimal TotalPrice => UnitPrice * Quantity; // Thành tiền
            public string ImageUrl { get; set; }
        }

        public class CustomerInfo
        {
            public string Name { get; set; }
            public string PhoneNumber { get; set; }
            public string Address { get; set; }
            public string Note { get; set; }
        }


        public class Cart
        {
            public List<CartItem> Items { get; set; } = new List<CartItem>(); // Danh sách sản phẩm trong giỏ hàng

            // Thêm sản phẩm vào giỏ
            public void AddItem(CartItem item)
            {
                var existingItem = Items.FirstOrDefault(i => i.ProductId == item.ProductId);

                if (existingItem != null)
                {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    existingItem.Quantity += item.Quantity;
                }
                else
                {
                    // Nếu sản phẩm chưa tồn tại, thêm mới
                    Items.Add(item);
                }
            }

            // Xóa sản phẩm khỏi giỏ
            public void RemoveItem(int productId)
            {
                var item = Items.FirstOrDefault(i => i.ProductId == productId);
                if (item != null)
                {
                    Items.Remove(item);
                }
            }

            // Tổng tiền của giỏ hàng
            public decimal TotalPrice => Items.Sum(i => i.TotalPrice);
        }

        public JsonResult AddToCart(int productId, int quantity = 1)
        {
            // Lấy giỏ hàng từ Session
            var cart = Session["Cart"] as Cart ?? new Cart();

            // Lấy thông tin sản phẩm từ database
            var product = db.products.FirstOrDefault(p => p.id == productId);

            if (product != null)
            {
                // Lấy hình ảnh chính của sản phẩm
                var mainImage = db.product_images.FirstOrDefault(img => img.product_id == productId && img.main_image);

                var cartItem = new CartItem
                {
                    ProductId = product.id,
                    ProductName = product.product_name,
                    UnitPrice = product.unit_price,
                    Quantity = quantity,
                    ImageUrl = mainImage?.url // URL của hình ảnh chính (nếu tồn tại)
                };

                cart.AddItem(cartItem);
                Session["Cart"] = cart; // Cập nhật giỏ hàng vào Session

                return Json(new { success = true, message = "Sản phẩm đã được thêm vào giỏ hàng." }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = false, message = "Không tìm thấy sản phẩm." }, JsonRequestBehavior.AllowGet);
        }


        public ActionResult ViewCart()
        {
            var cart = Session["Cart"] as Cart ?? new Cart();
            return View(cart);
        }

        public JsonResult RemoveFromCart(int productId)
        {
            var cart = Session["Cart"] as Cart;

            if (cart != null)
            {
                cart.RemoveItem(productId);
                Session["Cart"] = cart; // Cập nhật Session sau khi xóa

                return Json(new
                {
                    success = true,
                    totalPrice = cart.TotalPrice,
                    message = "Sản phẩm đã được xóa khỏi giỏ hàng."
                }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = false, message = "Không tìm thấy giỏ hàng hoặc sản phẩm." }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult UpdateQuantity(int productId, int quantity)
        {
            var cart = Session["Cart"] as Cart;

            if (cart != null)
            {
                var cartItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);

                if (cartItem != null)
                {
                    if (quantity > 0)
                    {
                        cartItem.Quantity = quantity; // Cập nhật số lượng
                    }
                    else
                    {
                        cart.RemoveItem(productId); // Xóa sản phẩm nếu số lượng <= 0
                    }

                    Session["Cart"] = cart; // Cập nhật giỏ hàng vào Session

                    return Json(new { success = true, totalPrice = cart.TotalPrice }, JsonRequestBehavior.AllowGet);
                }
            }

            return Json(new { success = false, message = "Không tìm thấy sản phẩm trong giỏ hàng." }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveCustomerInfo(string name, string phoneNumber, string address, string note)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(phoneNumber) || string.IsNullOrWhiteSpace(address))
            {
                return Json(new { success = false, message = "Vui lòng nhập đầy đủ thông tin." });
            }

            // Tạo đối tượng CustomerInfo và lưu vào session
            var customerInfo = new CustomerInfo
            {
                Name = name,
                PhoneNumber = phoneNumber,
                Address = address,
                Note = note
            };

            Session["CustomerInfo"] = customerInfo;

            // Debug để kiểm tra dữ liệu được lưu vào session
            System.Diagnostics.Debug.WriteLine($"Customer Info Saved: {customerInfo.Name}, {customerInfo.Address}");

            return Json(new { success = true, message = "Thông tin khách hàng đã được lưu." });
        }


        // Hàm kiểm tra số điện thoại hợp lệ
        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Kiểm tra số điện thoại chỉ chứa số và có độ dài từ 10-11 ký tự
            return System.Text.RegularExpressions.Regex.IsMatch(phoneNumber, @"^\d{10,11}$");
        }

        public ActionResult GetPaymentInfo()
        {
            var customerInfo = Session["CustomerInfo"];
            if (customerInfo == null)
            {
                return Json(new { success = false, message = "Chưa có thông tin khách hàng." }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { success = true, data = customerInfo }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateOrder()
        {
            if (Session["userInfo"] == null)
            {
                return Json(new { success = false, message = "Vui lòng đăng nhập để đặt hàng." }, JsonRequestBehavior.AllowGet);
            }
            try
            {
                // Lấy thông tin người dùng từ session
                var currentUser = Session["userInfo"] as user;

                // Lấy thông tin giỏ hàng từ Session
                var cart = Session["Cart"] as Cart;
                if (cart == null || !cart.Items.Any())
                {
                    return Json(new { success = false, message = "Giỏ hàng trống, không thể đặt hàng." }, JsonRequestBehavior.AllowGet);
                }

                // Lấy thông tin khách hàng từ Session
                var customerInfo = Session["CustomerInfo"] as CustomerInfo;
                if (customerInfo == null)
                {
                    return Json(new { success = false, message = "Chưa có thông tin khách hàng, vui lòng nhập thông tin." }, JsonRequestBehavior.AllowGet);
                }

                // Tạo đơn hàng mới
                var newOrder = new ORDER_1
                {
                    promotion_id = 1, // Nếu có promotion, bạn có thể thay đổi
                    user_id = currentUser.id, // ID người dùng từ session
                    created_at = DateTime.Now,
                    total_price = cart.TotalPrice,
                    note = customerInfo.Note,
                    order_status = "Pending", // Trạng thái mặc định
                    shipping_fee = 0, // Nếu có phí vận chuyển, bạn có thể thay đổi
                    shipping_method = "COD" // Hoặc hình thức khác
                };

                db.ORDER_1.Add(newOrder);
                db.SaveChanges();

                // Thêm chi tiết đơn hàng
                foreach (var item in cart.Items)
                {
                    var orderDetail = new order_details
                    {
                        order_id = newOrder.id,
                        product_id = item.ProductId,
                        quantity = item.Quantity,
                        unit_price = item.UnitPrice,
                        amount = item.TotalPrice
                    };

                    db.order_details.Add(orderDetail);

                    // Giảm số lượng sản phẩm trong kho
                    var product = db.products.FirstOrDefault(p => p.id == item.ProductId);
                    if (product != null)
                    {
                        product.product_detail.stock_quantity -= item.Quantity;
                        if (product.product_detail.stock_quantity < 0)
                        {
                            return Json(new { success = false, message = $"Sản phẩm {product.product_name} không đủ hàng trong kho." }, JsonRequestBehavior.AllowGet);
                        }
                    }
                }

                db.SaveChanges();

                //// Thêm thông tin vận chuyển
                var shipping = new shipping
                {
                    order_id = newOrder.id,
                    pickup_date = DateTime.Now,
                    shipping_status = "In Progress",
                    address = customerInfo.Address,
                    carrier = "J&T Expess" // Tên hãng vận chuyển, thay đổi nếu cần
                };

                db.shippings.Add(shipping);
                db.SaveChanges();

                // Xóa giỏ hàng sau khi đặt hàng thành công
                Session["Cart"] = null;
                Session["CustomerInfo"] = null;

                return Json(new { success = true, message = "Đặt hàng thành công.", orderId = newOrder.id }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Đã xảy ra lỗi: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
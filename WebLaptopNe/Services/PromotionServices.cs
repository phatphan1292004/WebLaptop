using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;

namespace WebLaptopNe.Services
{
    public class PromotionServices
    {
        WebPPNeEntities1 db = new WebPPNeEntities1();

        public JsonResult GetPromotions(string searchValue)
        {
            var promotions = (from p in db.promotions
                              where string.IsNullOrEmpty(searchValue) || p.promotion_name.Contains(searchValue)
                              select new
                              {
                                  PromotionId = p.id,
                                  PromotionName = p.promotion_name,
                                  StartDate = p.start_day,
                                  EndDate = p.end_day,
                                  DiscountPercent = p.discount_percent,
                                  PromotionType = p.promotion_type
                              }).ToList();

            return new JsonResult { Data = promotions, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Thêm một chương trình khuyến mãi mới
        public JsonResult AddPromotion(promotion model)
        {
            try
            {
                // Kiểm tra nếu tên chương trình đã tồn tại
                var existingPromotion = db.promotions.FirstOrDefault(p => p.promotion_name == model.promotion_name);
                if (existingPromotion != null)
                {
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Tên chương trình đã tồn tại." },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }

                // Kiểm tra logic ngày tháng
                if (model.end_day <= DateTime.Now)
                {
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Ngày kết thúc phải sau ngày hiện tại." },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }

                // Thêm chương trình mới
                model.start_day = DateTime.Now;
                db.promotions.Add(model);
                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Thêm chương trình thành công!" },
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

        public JsonResult DeletePromotion(int promotionId)
        {
            try
            {
                var promotion = db.promotions.FirstOrDefault(p => p.id == promotionId);
                if (promotion == null)
                {
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Không tìm thấy chương trình." },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }

                db.promotions.Remove(promotion);
                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Xóa chương trình thành công!" },
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

        // Lấy thông tin chi tiết chương trình theo ID
        public JsonResult GetPromotionById(int promotionId)
        {
            var promotion = db.promotions
                .Where(p => p.id == promotionId)
                .Select(p => new
                {
                    PromotionId = p.id,
                    PromotionName = p.promotion_name,
                    StartDate = p.start_day,
                    EndDate = p.end_day,
                    DiscountPercent = p.discount_percent,
                    PromotionType = p.promotion_type
                })
                .FirstOrDefault();

            if (promotion == null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Không tìm thấy chương trình." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            return new JsonResult
            {
                Data = promotion,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        // Cập nhật chương trình khuyến mãi
        public JsonResult UpdatePromotion(promotion model)
        {
            var existingPromotion = db.promotions.FirstOrDefault(p => p.id == model.id);
            if (existingPromotion == null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Không tìm thấy chương trình để cập nhật." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            try
            {
                // Cập nhật thông tin chương trình
                existingPromotion.promotion_name = model.promotion_name;
                existingPromotion.end_day = model.end_day;
                existingPromotion.discount_percent = model.discount_percent;
                existingPromotion.promotion_type = model.promotion_type;

                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Cập nhật chương trình thành công!" },
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

        public JsonResult AddProductToPromotion(int promotionId, int productId)
        {
            // Kiểm tra chương trình khuyến mãi
            var promotion = db.promotions.FirstOrDefault(p => p.id == promotionId);
            if (promotion == null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Chương trình khuyến mãi không tồn tại." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            // Kiểm tra sản phẩm
            var product = db.products.FirstOrDefault(p => p.id == productId);
            if (product == null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Sản phẩm không tồn tại." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            // Kiểm tra xem sản phẩm đã tồn tại trong chương trình chưa
            var existingEntry = db.promotion_programs.FirstOrDefault(pp => pp.promotion_id == promotionId && pp.product_id == productId);
            if (existingEntry != null)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Sản phẩm đã tồn tại trong chương trình khuyến mãi này." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

            // Thêm bản ghi mới vào bảng promotion_programs
            var promotionProgram = new promotion_programs
            {
                promotion_id = promotionId,
                product_id = productId
            };

            db.promotion_programs.Add(promotionProgram);

            try
            {
                db.SaveChanges();
                return new JsonResult
                {
                    Data = new { success = true, message = "Sản phẩm đã được thêm vào chương trình khuyến mãi thành công." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Đã xảy ra lỗi: " + ex.Message },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }


        public JsonResult GetProductsByPromotion(int promotionId)
        {
            var products = db.promotion_programs
                              .Where(pp => pp.promotion_id == promotionId)
                              .Join(db.products,
                                    pp => pp.product_id,
                                    p => p.id,
                                    (pp, p) => new
                                    {
                                        ProductId = p.id,
                                        ProductName = p.product_name,
                                        UnitPrice = p.unit_price
                                    })
                              .ToList();

            return new JsonResult
            {
                Data = new
                {
                    success = products.Any(),
                    message = products.Any() ? "Lấy danh sách sản phẩm thành công." : "Không có sản phẩm nào thuộc chương trình này.",
                    data = products
                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult RemoveProductFromPromotion(int promotionId, int productId)
        {
            try
            {
                // Tìm bản ghi trong bảng promotion_programs
                var promotionProduct = db.promotion_programs
                    .FirstOrDefault(pp => pp.promotion_id == promotionId && pp.product_id == productId);

                if (promotionProduct == null)
                {
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Sản phẩm không tồn tại trong chương trình khuyến mãi." },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }

                // Xóa bản ghi khỏi bảng promotion_programs
                db.promotion_programs.Remove(promotionProduct);
                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Sản phẩm đã được xóa khỏi chương trình khuyến mãi thành công." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Đã xảy ra lỗi: " + ex.Message },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }

        public JsonResult RemovePromotion(int promotionId)
        {
            try
            {
                // Tìm chương trình khuyến mãi
                var promotion = db.promotions.FirstOrDefault(p => p.id == promotionId);
                if (promotion == null)
                {
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Chương trình khuyến mãi không tồn tại." },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }

                // Xóa tất cả sản phẩm liên kết trong promotion_programs
                var relatedProducts = db.promotion_programs.Where(pp => pp.promotion_id == promotionId).ToList();
                db.promotion_programs.RemoveRange(relatedProducts);

                // Xóa chính chương trình khuyến mãi
                db.promotions.Remove(promotion);

                // Lưu thay đổi
                db.SaveChanges();

                return new JsonResult
                {
                    Data = new { success = true, message = "Chương trình khuyến mãi đã được xóa thành công." },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            catch (Exception ex)
            {
                return new JsonResult
                {
                    Data = new { success = false, message = "Đã xảy ra lỗi: " + ex.Message },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
        }
    }
}
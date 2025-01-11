using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;

namespace WebLaptopNe.Services
{
    public class ProductService
    {
        WebPPNeEntities1 _db = new WebPPNeEntities1();

        // Xóa sản phẩm
        public JsonResult DeleteProduct(int productId)
        {
            // Tìm sản phẩm trong cơ sở dữ liệu
            var product = _db.products.FirstOrDefault(p => p.id == productId);
            if (product == null)
            {
                return new JsonResult { Data = new { success = false, message = "Sản phẩm không tồn tại" } };
            }

            // Xóa hình ảnh liên quan (nếu có)
            var productImages = _db.product_images.Where(pi => pi.product_id == productId).ToList();
            _db.product_images.RemoveRange(productImages);

            // Xóa chi tiết sản phẩm (nếu có)
            var productDetail = _db.product_detail.FirstOrDefault(pd => pd.product_id == productId);
            if (productDetail != null)
            {
                _db.product_detail.Remove(productDetail);
            }

            // Xóa sản phẩm
            _db.products.Remove(product);

            // Lưu thay đổi vào cơ sở dữ liệu
            _db.SaveChanges();

            return new JsonResult { Data = new { success = true, message = "Sản phẩm đã được xóa thành công" } };
        }

        // Lấy danh sách sản phẩm
        public JsonResult GetProducts(string searchValue)
        {
            var products = (from p in _db.products
                            join c in _db.categories on p.category_id equals c.id
                            join pi in _db.product_images on p.id equals pi.product_id
                            where pi.main_image == true &&
                              (string.IsNullOrEmpty(searchValue) || p.product_name.Contains(searchValue))
                            select new
                            {
                                p.id,
                                p.product_name,
                                p.unit_price,
                                p.created_at,
                                CategoryName = c.category_name,
                                ImageUrl = pi.url // Lấy URL hình ảnh chính
                            }).ToList();

            return new JsonResult { Data = products, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public JsonResult GetProductDetails(int productId)
        {
            var productDetails = (from p in _db.products
                                  join c in _db.categories on p.category_id equals c.id
                                  join pd in _db.product_detail on p.id equals pd.product_id
                                  join pi in _db.product_images.Where(img => img.main_image == true) on p.id equals pi.product_id into images
                                  from mainImage in images.DefaultIfEmpty()
                                  where p.id == productId
                                  select new
                                  {
                                      ProductId = p.id,
                                      ProductName = p.product_name,
                                      UnitPrice = p.unit_price,
                                      CreatedAt = p.created_at,
                                      ProductStatus = p.product_status,
                                      Rating = p.rating,
                                      DiscountPercent = p.discount_percent,
                                      CategoryName = c.category_name,
                                      CategoryStock = c.stock_quantity,
                                      Weight = pd.weight,
                                      CPU = pd.cpu,
                                      GPU = pd.gpu,
                                      VGA = pd.vga,
                                      Ports = pd.port,
                                      RAM = pd.ram,
                                      Storage = pd.storage,
                                      Webcam = pd.webcam,
                                      Battery = pd.battery,
                                      OS = pd.os,
                                      ScreenSize = pd.screen_size,
                                      StockQuantity = pd.stock_quantity,
                                      WarrantyPeriod = pd.warranty_period,
                                      ImageUrl = mainImage.url
                                  }).FirstOrDefault();

            if (productDetails == null)
            {
                return new JsonResult { Data = new { success = true, message = "Sản phẩm không tồn tại" } };
            }

            return new JsonResult
            {
                Data = new { success = true, data = productDetails },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public class ProductViewModel
        {
            public int BrandId { get; set; }
            public int CategoryId { get; set; }
            public string ProductName { get; set; }
            public decimal UnitPrice { get; set; }
            public string ProductStatus { get; set; }
            public decimal Rating { get; set; }
            public decimal DiscountPercent { get; set; }
            public decimal Weight { get; set; }
            public string CPU { get; set; }
            public string GPU { get; set; }
            public string VGA { get; set; }
            public string Ports { get; set; }
            public string RAM { get; set; }
            public string Storage { get; set; }
            public string Webcam { get; set; }
            public string Battery { get; set; }
            public string OS { get; set; }
            public string ScreenSize { get; set; }
            public int StockQuantity { get; set; }
            public string WarrantyPeriod { get; set; }
            public List<string> ImageUrls { get; set; } // Danh sách URL hình ảnh
            public string MainImageUrl { get; set; }    // Hình ảnh chính
        }

        // Thêm sản phẩm mới với lưu hình ảnh vào thư mục Content/Images
        public JsonResult AddProductWithImages(ProductViewModel model, IEnumerable<HttpPostedFileBase> uploadedImages)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // 1. Thêm sản phẩm vào cơ sở dữ liệu
                    var product = AddProduct(model);

                    // 2. Thêm chi tiết sản phẩm vào cơ sở dữ liệu
                    AddProductDetail(product.id, model);

                    // 3. Xử lý hình ảnh tải lên và lưu vào cơ sở dữ liệu
                    SaveProductImages(product.id, uploadedImages);

                    // Commit transaction
                    transaction.Commit();

                    return new JsonResult
                    {
                        Data = new { success = true, message = "Thêm sản phẩm thành công" },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
                catch (Exception ex)
                {
                    // Rollback transaction nếu có lỗi
                    transaction.Rollback();
                    return new JsonResult
                    {
                        Data = new { success = false, message = "Có lỗi xảy ra: " + ex.Message },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
            }
        }

        private product AddProduct(ProductViewModel model)
        {
            var product = new product
            {
                brand_id = model.BrandId,
                category_id = model.CategoryId,
                product_name = model.ProductName,
                unit_price = model.UnitPrice,
                created_at = DateTime.Now,
                product_status = "Còn hàng",
                rating = model.Rating,
                discount_percent = model.DiscountPercent
            };

            _db.products.Add(product);
            _db.SaveChanges();

            return product;
        }

        private void AddProductDetail(int productId, ProductViewModel model)
        {
            var productDetail = new product_detail
            {
                product_id = productId,
                weight = model.Weight,
                cpu = model.CPU,
                gpu = model.GPU,
                vga = model.VGA,
                port = model.Ports,
                ram = model.RAM,
                storage = model.Storage,
                webcam = model.Webcam,
                battery = model.Battery,
                os = model.OS,
                screen_size = model.ScreenSize,
                stock_quantity = model.StockQuantity,
                warranty_period = model.WarrantyPeriod
            };

            _db.product_detail.Add(productDetail);
            _db.SaveChanges();
        }

        private void SaveProductImages(int productId, IEnumerable<HttpPostedFileBase> uploadedImages)
        {
            if (uploadedImages == null || !uploadedImages.Any())
            {
                throw new ArgumentException("Danh sách hình ảnh tải lên trống.");
            }

            var imageFolder = HttpContext.Current.Server.MapPath("~/Content/Images/");

            // Tạo thư mục nếu chưa tồn tại
            if (!Directory.Exists(imageFolder))
            {
                try
                {
                    Directory.CreateDirectory(imageFolder);
                }
                catch (Exception ex)
                {
                    throw new Exception($"Không thể tạo thư mục lưu trữ hình ảnh: {ex.Message}");
                }
            }

            bool isFirstImage = true; // Biến xác định hình ảnh đầu tiên

            foreach (var uploadedImage in uploadedImages)
            {
                if (uploadedImage != null && uploadedImage.ContentLength > 0)
                {
                    try
                    {
                        // Tạo tên file duy nhất
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadedImage.FileName);
                        var filePath = Path.Combine(imageFolder, fileName);

                        // Lưu file vào thư mục Images
                        uploadedImage.SaveAs(filePath);

                        // Tạo đường dẫn URL để lưu vào cơ sở dữ liệu
                        var imageUrl = "/Content/Images/" + fileName;

                        // Thêm ảnh vào bảng product_images
                        var productImage = new product_images
                        {
                            product_id = productId,
                            url = imageUrl,
                            main_image = isFirstImage // Đặt hình ảnh đầu tiên là main_image
                        };

                        _db.product_images.Add(productImage);

                        isFirstImage = false; // Sau hình ảnh đầu tiên, tất cả main_image sẽ là false
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi khi lưu file
                        throw new Exception($"Lỗi khi xử lý hình ảnh: {uploadedImage.FileName}. Chi tiết: {ex.Message}");
                    }
                }
            }

            try
            {
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception($"Không thể lưu thông tin hình ảnh vào cơ sở dữ liệu: {ex.Message}");
            }
        }
    }
}
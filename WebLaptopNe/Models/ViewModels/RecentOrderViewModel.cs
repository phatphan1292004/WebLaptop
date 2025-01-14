using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebLaptopNe.Models.ViewModels
{
    public class RecentOrderViewModel
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
    }
    public class CustomerTypeViewModel
    {
        public string Type { get; set; } // Loại khách hàng (VIP, Thường xuyên, Mới)
        public int Count { get; set; }  // Số lượng khách hàng
    }

    public class DashboardViewModel
    {
        public List<CustomerTypeViewModel> CustomerTypeDistribution { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalOrders { get; set; }
        public List<RecentOrderViewModel> RecentOrders { get; set; }
        public List<TopProductViewModel> TopProducts { get; set; }
    }

    public class TopProductViewModel
    {
        public string ProductName { get; set; }
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
        public int StockQuantity { get; set; }
    }

    public class HomePageViewModel
    {
        public List<product> Products { get; set; }
        public List<product_images> ProductImages { get; set; }
        public List<PromotionViewModel> Promotions { get; set; }
    }

    public class PromotionViewModel
    {
        public string PromotionName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<PromotionProductViewModel> Products { get; set; }
    }

    public class PromotionProductViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPrice { get; set; }

        public decimal DiscountPercent { get; set; }
        public string ProductImage { get; set; }
    }
}
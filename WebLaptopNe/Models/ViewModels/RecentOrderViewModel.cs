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

    public class DashboardViewModel
    {
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
}
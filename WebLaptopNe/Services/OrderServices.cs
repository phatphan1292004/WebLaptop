using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebLaptopNe.Models;

namespace WebLaptopNe.Services
{
    public class OrderServices
    {
        WebPPNeEntities1 db = new WebPPNeEntities1();

        // Lấy danh sách đơn hàng
        public JsonResult GetOrders(string searchValue, string status)
        {
            var orders = (from o in db.ORDER_1
                          join s in db.shippings on o.id equals s.order_id
                          join u in db.users on o.user_id equals u.id
                          where
                              (string.IsNullOrEmpty(searchValue) || u.cus_name.Contains(searchValue)) &&
                              (string.IsNullOrEmpty(status) || o.order_status == status)
                          select new
                          {
                              OrderId = o.id,
                              CustomerName = u.cus_name,
                              OrderDate = o.created_at,
                              DeliveryAddress = s.address,
                              OrderStatus = o.order_status,
                              TotalPrice = o.total_price,
                              Carrier = s.carrier
                          }).OrderByDescending(o => o.OrderDate).ToList();

            return new JsonResult { Data = orders, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        // Lấy chi tiết đơn hàng
        public object GetOrderDetails(int orderId)
        {
            var order = (from o in db.ORDER_1
                         join s in db.shippings on o.id equals s.order_id
                         join u in db.users on o.user_id equals u.id
                         where o.id == orderId
                         select new
                         {
                             CustomerName = u.cus_name,
                             DeliveryAddress = s.address,
                             Phone = u.phone,
                             CreatedAt = o.created_at,
                             TotalAmount = o.total_price,
                             Items = (from d in db.order_details
                                      join p in db.products on d.product_id equals p.id
                                      where d.order_id == orderId
                                      select new
                                      {
                                          ProductId = p.id,
                                          ProductName = p.product_name,
                                          Quantity = d.quantity,
                                          UnitPrice = d.unit_price,
                                          Amount = d.amount
                                      }).ToList()
                         }).FirstOrDefault();

            return order;
        }

        // Xác nhận đơn hàng
        public bool ApproveOrder(int orderId)
        {
            var order = db.ORDER_1.FirstOrDefault(o => o.id == orderId);
            if (order == null)
            {
                return false;
            }

            // Cập nhật trạng thái đơn hàng
            order.order_status = "Approved"; // Hoặc trạng thái khác bạn muốn
            db.SaveChanges();

            return true;
        }

        // Từ chối đơn hàng
        public bool RejectOrder(int orderId)
        {
            var order = db.ORDER_1.FirstOrDefault(o => o.id == orderId);
            if (order == null)
            {
                return false;
            }

            // Cập nhật trạng thái đơn hàng
            order.order_status = "Rejected"; // Hoặc trạng thái khác bạn muốn
            db.SaveChanges();

            return true;
        }
    }
}
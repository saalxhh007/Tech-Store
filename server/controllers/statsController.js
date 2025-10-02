import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";

export const getProductsOfTheWeek = async (req, res) => {
  try {
    const products = await productModel.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTopDeals = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      {
        $addFields: {
          discount: { $subtract: ["$originalPrice", "$price"] },
        },
      },
      { $sort: { discount: -1 } },
      { $limit: 8 },
    ])

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    const { userId } = req.user.id

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" })

    const products = await productModel.aggregate([{ $sample: { size: 8 } }])

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMostPopularProducts = async (req, res) => {
  try {
    const mostPopular = await orderModel.aggregate([
       { $unwind: "$products" },
        { $group: { _id: "$products.product", totalSold: { $sum: "$products.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 8 },
        {
            $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
            }
        },
        { $unwind: "$product" }
    ])
      
    res.json(mostPopular)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const salesAgg = await orderModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ])
    const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0

    const totalOrders = await orderModel.countDocuments()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newCustomers = await userModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

    const lowStockItems = await productModel.find({ stock: { $lt: 5 } }).select("name stock")

    res.json({
      totalSales,
      totalOrders,
      newCustomers,
      lowStockItems,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMonthlySales = async (req, res) => {
  try {
    const salesAgg = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ])

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    const salesData = salesAgg.map(s => ({
      month: months[s._id - 1],
      sales: s.sales,
      orders: s.orders
    }))

    res.json(salesData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error fetching monthly sales", error })
  }
}

export const getRevenueGrowth = async (req, res) => {
  try {
    const revenueAgg = await orderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
          cost: { $sum: "$cost" }
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const revenueGrowthData = revenueAgg.map(r => ({
      month: months[r._id - 1],
      revenue: r.revenue,
      profit: r.revenue - (r.cost || 0),
    }));

    res.json(revenueGrowthData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching revenue growth", error });
  }
}

export const getCustomerActivity = async (req, res) => {
  try {
    const activityAgg = await orderModel.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          purchases: { $sum: 1 },
        },
      },
    ]);

    const dayMap = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const customerActivityData = activityAgg.map(a => ({
      day: dayMap[a._id % 7],
      visitors: a.purchases * 10,
      purchases: a.purchases,
    }));

    res.json(customerActivityData)
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer activity", error });
  }
}

export const getAverageOrderValue = async (req, res) => {
  try {
    const salesAgg = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const aov = salesAgg.length > 0 && salesAgg[0].totalOrders > 0
      ? salesAgg[0].totalRevenue / salesAgg[0].totalOrders
      : 0;

    res.json({ averageOrderValue: aov });
  } catch (error) {
    res.status(500).json({ message: "Error fetching AOV", error });
  }
}
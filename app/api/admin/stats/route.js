import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/mongodb";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function GET() {
  const db = await connectToDatabase();

  // Total Orders
  const totalOrders = await db.collection("orders").countDocuments();

  // Total Revenue
  const revenueAgg = await db.collection("orders").aggregate([
    { $match: { status: { $in: ["Paid", "paid"] } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]).toArray();
  const totalRevenue = revenueAgg[0]?.total || 0;

  // New Users (last 30 days)
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const newUsers = await db.collection("users").countDocuments({ createdAt: { $gte: since } });

  // Sold Items (sum of all order items)
  const soldItemsAgg = await db.collection("orders").aggregate([
    { $unwind: "$items" },
    { $group: { _id: null, total: { $sum: "$items.quantity" } } }
  ]).toArray();
  const soldItems = soldItemsAgg[0]?.total || 0;

  // Total Visits (real)
  const totalVisits = await db.collection("visits").countDocuments();
  // Total Returns (mock)
  const totalReturns = 178;

  // Sales by day (last 7 days)
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6);
  let salesByDay = await db.collection("orders").aggregate([
    { $match: { createdAt: { $gte: weekAgo }, status: { $in: ["Paid", "paid"] } } },
    { $group: {
      _id: { $dateToString: { format: "%w", date: "$createdAt" } },
      sales: {
        $sum: {
          $cond: [
            { $ne: ["$amount", null] },
            { $toDouble: "$amount" },
            {
              $cond: [
                { $ne: ["$price", null] },
                { $toDouble: "$price" },
                0
              ]
            }
          ]
        }
      },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]).toArray();
  // Map numeric day to weekday name
  salesByDay = salesByDay.map(d => ({ ...d, _id: WEEKDAYS[parseInt(d._id, 10)] }));

  // Order status by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  const orderStatusByMonth = await db.collection("orders").aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: {
      _id: { $dateToString: { format: "%b", date: "$createdAt" } },
      orders: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]).toArray();

  // Top brands (real)
  const brandsAgg = await db.collection("products").aggregate([
    { $group: { _id: { $ifNull: ["$brand", "Other"] }, value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $limit: 4 },
    { $project: { name: "$_id", value: 1, _id: 0 } }
  ]).toArray();
  const topBrands = brandsAgg;

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    newUsers,
    soldItems,
    totalVisits,
    totalReturns,
    salesByDay,
    orderStatusByMonth,
    topBrands,
  });
} 
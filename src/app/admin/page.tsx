"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStats } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { supabase } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all stats in parallel
      const [ordersRes, revenueRes, productsRes, usersRes, pendingRes, activeRes] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact" }),
        supabase.from("orders").select("total_amount").eq("payment_status", "paid"),
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "user"),
        supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("orders").select("id", { count: "exact" }).eq("status", "renting"),
      ]);

      const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        total_orders: ordersRes.count || 0,
        total_revenue: totalRevenue,
        total_products: productsRes.count || 0,
        total_users: usersRes.count || 0,
        pending_orders: pendingRes.count || 0,
        active_rentals: activeRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Total Pesanan",
      value: stats?.total_orders || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "bg-blue-500",
    },
    {
      name: "Pendapatan",
      value: `Rp${(stats?.total_revenue || 0).toLocaleString("id-ID")}`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      name: "Produk",
      value: stats?.total_products || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-purple-500",
    },
    {
      name: "User",
      value: stats?.total_users || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656.126-1.283.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-orange-500",
    },
    {
      name: "Menunggu Konfirmasi",
      value: stats?.pending_orders || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-yellow-500",
    },
    {
      name: "Sedang Disewa",
      value: stats?.active_rentals || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-emerald-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview bisnis rental Anda</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <div className="text-white">{card.icon}</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{card.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity / Quick Actions */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="ml-3 font-medium text-gray-700">Tambah Produk Baru</span>
            </a>
            <a
              href="/admin/orders"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="ml-3 font-medium text-gray-700">Lihat Semua Pesanan</span>
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">💡 Tips</h2>
          <ul className="space-y-2 text-sm text-blue-100">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Periksa pesanan pending setiap hari untuk respon cepat
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Update stok produk secara berkala
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Konfirmasi pembayaran segera setelah diterima
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

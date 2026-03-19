"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabaseClient } from "@/lib/supabase";
import { Order, OrderStatus, PaymentStatus } from "@/types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const supabase = getSupabaseClient();

  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from("orders")
        .select(`
          *,
          user:profiles (
            id,
            full_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
      fetchOrders();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Gagal update status pesanan");
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus
  ) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: paymentStatus })
        .eq("id", orderId);

      if (error) throw error;
      fetchOrders();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Gagal update status pembayaran");
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      renting: "bg-purple-100 text-purple-700",
      returned: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      rejected: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-gray-100 text-gray-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Dikonfirmasi" },
    { value: "renting", label: "Sedang Disewa" },
    { value: "returned", label: "Dikembalikan" },
    { value: "cancelled", label: "Dibatalkan" },
    { value: "rejected", label: "Ditolak" },
  ];

  const paymentOptions: { value: PaymentStatus; label: string }[] = [
    { value: "pending", label: "Belum Bayar" },
    { value: "paid", label: "Lunas" },
    { value: "failed", label: "Gagal" },
    { value: "refunded", label: "Refund" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
        <p className="text-gray-600 mt-1">Kelola semua pesanan rental</p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Semua
        </button>
        {["pending", "confirmed", "renting", "returned", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-600">
                        {order.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {(order.user as any)?.full_name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(order.user as any)?.email || ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.start_date).toLocaleDateString("id-ID")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.rental_days} hari
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        Rp{order.total_amount.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowModal(false)}
            />

            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Pesanan
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Informasi Customer
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nama:</span>
                      <p className="font-medium">
                        {(selectedOrder.user as any)?.full_name || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">
                        {(selectedOrder.user as any)?.email || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">WhatsApp:</span>
                      <p className="font-medium">
                        {(selectedOrder.user as any)?.phone || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">ID Pesanan:</span>
                      <p className="font-mono text-xs">
                        {selectedOrder.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Tanggal Sewa</span>
                    <p className="font-medium">
                      {new Date(selectedOrder.start_date).toLocaleDateString(
                        "id-ID"
                      )}{" "}
                      -{" "}
                      {new Date(selectedOrder.end_date).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Durasi</span>
                    <p className="font-medium">{selectedOrder.rental_days} hari</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Total</span>
                    <p className="font-medium text-lg">
                      Rp{selectedOrder.total_amount.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Catatan</span>
                    <p className="font-medium">
                      {selectedOrder.notes || "-"}
                    </p>
                  </div>
                </div>

                {/* Status Updates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Pesanan
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          selectedOrder.id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Pembayaran
                    </label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) =>
                        updatePaymentStatus(
                          selectedOrder.id,
                          e.target.value as PaymentStatus
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {paymentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Catatan dari Customer
                    </h4>
                    <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

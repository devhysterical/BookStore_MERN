import React from "react";
import { Link } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
} from "../../../redux/features/orders/ordersApi";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Confirmed":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-indigo-100 text-indigo-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    case "Cancelled":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ManageOrdersPage = () => {
  const { data, isLoading, isError, error, refetch } = useGetAllOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder({
        id: orderId,
        data: { paymentStatus: newStatus },
      }).unwrap();
      toast.success("Order status updated successfully!");
    } catch (err) {
      toast.error(
        `Failed to update order status: ${err?.data?.message || err.error}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-purple-600"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 mt-10 p-4 bg-red-100 rounded-md">
        Error loading orders: {error?.data?.message || error.error}
      </div>
    );
  }

  const orders = data || [];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no orders to display.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="font-mono text-xs">{order._id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.user?.name || order.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* Dropdown for changing status */}
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={isUpdating}
                        className={`w-full p-1.5 rounded-md text-xs font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${getStatusBadgeClass(
                          order.paymentStatus
                        )}`}
                        aria-label={`Update status for order ${order._id}`}>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Failed">Failed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/dashboard/orders/${order._id}`} // Ensure this route exists
                        className="text-purple-600 hover:text-purple-900 transition-colors duration-150 flex items-center"
                        title="View Details">
                        <FaEye className="h-5 w-5 mr-1" /> Details
                      </Link>
                      {/* Add other actions like delete here if needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Add Pagination Controls Here Later */}
          {/* <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            Pagination...
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;

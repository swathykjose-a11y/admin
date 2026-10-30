import { Search, Mail, Phone, Calendar } from "lucide-react";

const sampleCustomers = [
  {
    id: "cust_1",
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    ordersCount: 4,
    totalSpent: "$542.00",
    joinedDate: "Aug 14, 2026",
    city: "Springfield, OR",
  },
  {
    id: "cust_2",
    name: "Alex Rivera",
    email: "alex@example.com",
    phone: "+1 (555) 876-5432",
    ordersCount: 2,
    totalSpent: "$189.50",
    joinedDate: "Sep 02, 2026",
    city: "Bikini Bottom, CA",
  },
  {
    id: "cust_3",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    ordersCount: 1,
    totalSpent: "$240.00",
    joinedDate: "Oct 28, 2026",
    city: "London, UK",
  },
  {
    id: "cust_4",
    name: "Marcus Vance",
    email: "marcus@example.com",
    phone: "+1 (555) 345-6789",
    ordersCount: 5,
    totalSpent: "$694.00",
    joinedDate: "Jul 19, 2026",
    city: "Quahog, RI",
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111815]">Customer Management</h1>
        <p className="text-sm text-[#737F76] mt-0.5">
          View customer profiles, order history, and contact information.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8E4] flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#737F76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or city..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAF9] border border-[#E2E8E4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#194F36]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E2E8E4] rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAF9] text-xs font-semibold text-[#737F76] uppercase tracking-wider border-b border-[#E2E8E4]">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3">Total Spend</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8E4]">
            {sampleCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-[#F2F5EF]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-[#111815]">{cust.name}</div>
                  <div className="flex items-center gap-3 text-xs text-[#737F76] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {cust.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {cust.phone}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#58635D]">{cust.city}</td>
                <td className="px-6 py-4 font-medium text-[#111815]">
                  {cust.ordersCount} orders
                </td>
                <td className="px-6 py-4 font-bold text-[#111815]">{cust.totalSpent}</td>
                <td className="px-6 py-4 text-xs text-[#737F76]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {cust.joinedDate}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-medium text-[#194F36] hover:underline">
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


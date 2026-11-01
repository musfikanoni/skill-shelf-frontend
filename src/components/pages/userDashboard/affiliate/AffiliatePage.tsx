"use client";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
// import { useCreateAffiliateMutation, useGetMyCommissionQuery } from "@/redux/api/userDashboardApi/affiliate";
import { useState } from "react";
import {
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Copy,
  Link as LinkIcon,
  Download,
  Video,
} from "lucide-react";
import { useCreateAffiliateMutation, useGetMyCommissionQuery } from "@/redux/api/userDashboardApi/affiliateApi";

// --- Types & Mock Data ---
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  isPrimary?: boolean;
  subText?: string;
}

interface SaleRecord {
  date: string;
  product: string;
  commission: string;
}

const MOCK_SALES: SaleRecord[] = [
  {
    date: "Apr 20, 2026",
    product: "Marketing Templates",
    commission: "$23.50",
  },
  { date: "Apr 19, 2026", product: "SEO Toolkit", commission: "$48.50" },
  {
    date: "Apr 18, 2026",
    product: "Social Graphics Pack",
    commission: "$23.50",
  },
];

// --- Sub-Components ---

const StatCard = ({
  title,
  value,
  change,
  icon,
  isPrimary,
  subText,
}: StatCardProps) => {
  const hoverBgColor = isPrimary
    ? "hover:bg-[#00B087] hover:text-white"
    : "hover:bg-gray-50";

  const activeHoverClasses =
    "transition-all duration-300 hover:bg-[#00B087] hover:text-white group border border-gray-100 shadow-sm";

  return (
    <div
      className={`p-6 rounded-2xl bg-white text-gray-800 ${activeHoverClasses}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 group-hover:text-white/80 transition-colors">
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2 group-hover:text-white transition-colors">
            {value}
          </h3>
          <p
            className={`text-xs mt-2 font-semibold transition-colors ${
              change.startsWith("+") ? "text-green-500" : "text-gray-400"
            } group-hover:text-white/90`}
          >
            {change}{" "}
            <span className="font-normal opacity-70 group-hover:text-white/70">
              {subText || "this week"}
            </span>
          </p>
        </div>
        <div
          className={`p-3 rounded-xl transition-all duration-300 
                    ${
                      isPrimary
                        ? "bg-[#00B087]/10 text-[#00B087]"
                        : title === "Total Sales"
                          ? "bg-green-50 text-green-500"
                          : title === "Conversion Rate"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-blue-50 text-blue-500"
                    } 
                    group-hover:bg-white/20 group-hover:text-white`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function Affiliate() {
  const { data: affiliateData, isLoading, error, refetch: refetchCommissions } = useGetMyCommissionQuery();
  const affiliateCommissionData = affiliateData?.data;

  const { data: getMeData, refetch: refetchUserData } = useGetMeQuery("");
  
  // Form state
  const [formData, setFormData] = useState({
    referredUserEmail: "",
    amount: "",
  });
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const referralLink = `${getMeData?.data?.affiliateCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Link copied!");
  };

  const [createAffiliate, { isLoading: isCreating }] = useCreateAffiliateMutation();

  // Function to fetch user ID by email
  const getUserIdByEmail = async (email: string) => {
    try {
      // Option 3: For now, we'll simulate - you'll need to implement this based on your API
      console.log("Looking up user by email:", email);
      // Return the email as fallback - but ideally you should get the actual user ID
      return email;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("User not found");
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous errors/success when user starts typing
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.referredUserEmail) {
      setSubmitError("Please enter the referred user's email");
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setSubmitError("Please enter a valid amount");
      return;
    }
    
    // Clear previous messages
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsCheckingEmail(true);
    
    try {

      const payload = {
        referredUser: formData.referredUserEmail, // Send email directly
        amount: parseFloat(formData.amount),
      };

      
      console.log("Sending payload:", payload);
      const result = await createAffiliate(payload).unwrap();
      
      // Handle successful submission
      setSubmitSuccess(result.message || "Referral submitted successfully!");
      
      // Reset form
      setFormData({
        referredUserEmail: "",
        amount: "",
      });
      

      refetchCommissions();
      

      setTimeout(() => {
        setSubmitSuccess(null);
      }, 3000);
      
    } catch (err: any) {
      console.error("Submission error:", err);
      // Handle error
      const errorMessage = err?.data?.message || err?.message || "Failed to submit referral. Please try again.";
      setSubmitError(errorMessage);
      

      setTimeout(() => {
        setSubmitError(null);
      }, 3000);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <div className="space-y-8 bg-gray-50/30 min-h-screen font-sans">
      {/* Header Section */}
      <header className="bg-[#008F68] p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
        <p className="text-white/80 mt-1">
          Track your earnings and performance
        </p>
      </header>

      {/* Referral Link Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
            <LinkIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Your Referral Link
            </h2>
            <p className="text-gray-500 text-sm">
              Share and earn 50% commission
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            readOnly
            value={getMeData?.data?.affiliateCode || ""}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-[#F9C828] hover:bg-[#eab308] text-gray-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-yellow-200"
          >
            <Copy size={20} />
            Copy Link
          </button>
        </div>

        <div className="bg-[#E8F8F2] border border-[#B2EBD6] p-3 rounded-xl items-center gap-2 text-[#008F68] font-semibold text-sm">
          <div className="flex items-center pb-7 gap-3 text-black font-bold text-lg">
            <h2 className="tracking-tight">Apply for Referral Commission</h2>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {submitSuccess}
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Referred User Email *
                </label>
                <input
                  type="email"
                  name="referredUserEmail"
                  value={formData.referredUserEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isCreating || isCheckingEmail}
                className="flex items-center gap-2 px-6 py-2.5 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black font-bold rounded-lg active:shadow-none active:translate-y-1 transition-all cursor-pointer shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isCreating || isCheckingEmail) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    {isCheckingEmail ? "Validating user..." : "Submitting..."}
                  </>
                ) : (
                  "Submit Referral"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Recent Sales</h2>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading commissions...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Error loading data
            </div>
          ) : !affiliateCommissionData ||
            affiliateCommissionData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No commissions found
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="px-8 py-4 font-semibold">Date</th>
                  <th className="px-8 py-4 font-semibold">Referred User</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {affiliateCommissionData.map((sale) => (
                  <tr
                    key={sale._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-5 text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-semibold text-gray-800">
                        {sale.referredUser?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sale.referredUser?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sale.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : sale.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-[#00B087]">
                      ${sale.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
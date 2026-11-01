"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
// import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { useDeleteAffiliateMutation, useGetAffiliatesQuery, useUpdateAffiliateMutation } from "@/redux/api/userDashboardApi/affiliateApi";
import { AffiliateDetailsModal } from "./AffiliateDetailsModal";
import { Affiliate, AffiliateTable } from "@/components/shared/affiliate/AffiliateTable";
import { AffiliateStatCard } from "@/components/shared/affiliate/AffiliateStatCard";
import { DeleteConfirmationDialog } from "@/components/shared/users/DeleteConfirmationDialog";

export default function AffiliatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [affiliateToDelete, setAffiliateToDelete] = useState<Affiliate | null>(null);
  const pageSize = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: affiliatesData, isLoading } = useGetAffiliatesQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: debouncedSearchTerm,
    status: statusFilter,
  });

  const [updateAffiliate] = useUpdateAffiliateMutation();
  const [deleteAffiliate] = useDeleteAffiliateMutation();

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleApprove = async (item: Affiliate) => {
    const toastId = toast.loading("Approving affiliate...");
    try {
      await updateAffiliate({ id: item._id, status: "APPROVED" }).unwrap();
      toast.success("Affiliate approved successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve affiliate", { id: toastId });
    }
  };

  const handleReject = async (item: Affiliate) => {
    const toastId = toast.loading("Rejecting affiliate...");
    try {
      await updateAffiliate({ id: item._id, status: "REJECT" }).unwrap();
      toast.success("Affiliate rejected successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject affiliate", { id: toastId });
    }
  };

  const handleDelete = (item: Affiliate) => {
    setAffiliateToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!affiliateToDelete) return;

    const toastId = toast.loading("Deleting affiliate...");
    try {
      await deleteAffiliate(affiliateToDelete._id).unwrap();
      toast.success("Affiliate deleted successfully!", { id: toastId });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete affiliate", { id: toastId });
    }
  };

  const handleViewDetails = (item: Affiliate) => {
    setSelectedAffiliate(item);
    setIsDetailsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const affiliates = affiliatesData?.data?.data || [];
  const meta = affiliatesData?.data?.meta || { total: 0 };

  // Frontend-side filtering for search
  const filteredAffiliates = useMemo(() => {
    if (!searchTerm.trim()) return affiliates;
    
    const query = searchTerm.toLowerCase();
    return affiliates.filter((item: Affiliate) => {
      const name = item.user?.name?.toLowerCase() || "";
      const email = item.user?.email?.toLowerCase() || "";
      const referredName = item.referredUser?.name?.toLowerCase() || "";
      
      return name.includes(query) || email.includes(query) || referredName.includes(query);
    });
  }, [affiliates, searchTerm]);

  return (
    <div>
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B]">
          Affiliate
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-medium mt-1">
          Manage affiliate partners and commissions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:py-6 lg:py-8 md:gap-6">
        <AffiliateStatCard label="Total Earnings" value={`$${meta.total * 50}`} color="emerald" />
        <AffiliateStatCard label="Active Affiliates" value={meta.total.toString()} color="purple" />
        <AffiliateStatCard label="Pending Approval" value="0" color="yellow" />
        <AffiliateStatCard label="Total Sales" value={meta.total.toString()} color="blue" />
      </div>

      <div className="py-6 lg:py-8">
        <AffiliateTable
          data={filteredAffiliates}
          isLoading={isLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          totalItems={searchTerm.trim() ? filteredAffiliates.length : meta.total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          tableTitle="All Affiliates"
        />
      </div>

      <AffiliateDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        affiliate={selectedAffiliate}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Affiliate?"
        description={`Are you sure you want to delete ${affiliateToDelete?.user?.name}? This action cannot be undone.`}
      />
    </div>
  );
}

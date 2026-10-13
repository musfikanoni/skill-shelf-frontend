"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatCard } from "@/components/shared/orderStateCard/OrderStateCard";
import { UsersTable } from "@/components/shared/users/Userstable";
import { Membership, Users } from "@/types/users.type";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/api/userDashboardApi/userManagementApi";
import { UserDetailsModal } from "@/components/shared/users/UserDetailsModal";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const pageSize = 10;

  const { data: apiResponse, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm,
    role: selectedPlan === "all" ? undefined : selectedPlan,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const usersData: Users[] = (apiResponse?.data || []).map((user: any) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    membership: user.role as Membership,
    purchases: 0,
    totalSpent: 0,
    joined: user.createdAt,
    isActive: user.isActive,
    isVerified: user.isVerified,
  }));

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: Membership | "all") => {
    setSelectedPlan(status);
    setCurrentPage(1);
  };

  const handleView = (user: Users) => {
    if (user.id) {
      setViewingUserId(user.id);
    }
  };

  const handleDelete = (user: Users) => {
    if (user.id) {
      setDeletingUserId(user.id);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUserId) return;
    try {
      await deleteUser(deletingUserId).unwrap();
      toast.success("User deleted successfully");
      setDeletingUserId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  const handleRefresh = (user: Users) => {
    console.log("Refresh user:", user);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B]">
          Users
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-medium mt-1">
          Manage customer accounts and memberships
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:py-6 lg:py-8 md:gap-6">
        <OrderStatCard
          icon={""}
          label="Total Users"
          value={apiResponse?.meta?.total?.toLocaleString() || "0"}
          borderColor="border-purple-500"
          titleTextColor="text-purple-500"
        />
        <OrderStatCard
          icon={""}
          label="Basic Members"
          value="0"
          borderColor="border-green-500"
          titleTextColor="text-green-500"
        />
        <OrderStatCard
          icon={""}
          label="Pro Members"
          value="0"
          borderColor="border-yellow-500"
          titleTextColor="text-yellow-500"
        />
        <OrderStatCard
          icon={""}
          label="VIP Members"
          value="0"
          borderColor="border-red-500"
          titleTextColor="text-red-500"
        />
      </div>

      <div className="sm:py-6 lg:py-8">
        <main className="w-full bg-white p-5 rounded-lg">
          <div className="mx-auto">
            <UsersTable
              data={usersData}
              isLoading={isLoading}
              onView={handleView}
              onDelete={handleDelete}
              onRefresh={handleRefresh}
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              totalItems={apiResponse?.meta?.total || 0}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              tableTitle="All Users"
            />
          </div>
        </main>
      </div>

      <UserDetailsModal
        userId={viewingUserId}
        isOpen={!!viewingUserId}
        onClose={() => setViewingUserId(null)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingUserId}
        onOpenChange={(open) => !open && setDeletingUserId(null)}
      >
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
          <div className="p-8 space-y-6">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-[#0F172A] leading-tight">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-base font-medium leading-relaxed">
                Are you sure you want to delete this user? This action is
                permanent and cannot be reversed.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeletingUserId(null)}
                className="h-12 px-6 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="h-12 px-8 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center gap-2"
              >
                {isDeleting ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {isDeleting ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

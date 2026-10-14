"use client";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  SvgRevenue,
  SvgSubscribers,
  SvgActivePlans,
  SvgAvgRevenue,
} from "@/lib/icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useDeletePlanMutation,
  useGetAllPlansQuery,
  useGetAllSubscriptionsQuery,
} from "@/redux/api/userDashboardApi/subscriptionApi";
import { useGetDashboardOverviewQuery } from "@/redux/api/adminDashboardApi/AdminDashboardApi";
import SubscriptionsClientManager from "./SubscriptionsClientManager";
import { SubscriptionsStatCard } from "./SubscriptionsStatCard";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";
import { CreateSubscriptionPlanModal } from "./CreateSubscriptionPlanModal";
import { SubscriptionsTable } from "@/components/shared/subscriptionsTable/SubscriptionsTable";

export default function SubscriptionsPage() {
  const { data: subscriptionsData, isLoading: subLoading } =
    useGetAllSubscriptionsQuery();
  const { data: plansData, isLoading: plansLoading } = useGetAllPlansQuery();
  const { data: overviewResponse, isLoading: overviewLoading } =
    useGetDashboardOverviewQuery({});
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    initialData?: any;
  }>({
    isOpen: false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    planId: string | null;
  }>({
    isOpen: false,
    planId: null,
  });

  const openCreateModal = () => {
    setModalState({ isOpen: true });
  };

  const openEditModal = (plan: any) => {
    setModalState({
      isOpen: true,
      initialData: plan,
    });
  };

  const initiateDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, planId: id });
  };

  const handlePlanDelete = async () => {
    if (!deleteConfirm.planId) return;

    try {
      await deletePlan(deleteConfirm.planId).unwrap();
      toast.success("Subscription plan deleted successfully!");
      setDeleteConfirm({ isOpen: false, planId: null });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete plan");
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  const isLoading = subLoading || plansLoading || overviewLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  const subscriptions = subscriptionsData?.data || [];
  const plans = plansData?.data || [];
  const stats = overviewResponse?.data || {};

  const arpu =
    stats.totalUsers > 0
      ? (stats.totalRevenue / stats.totalUsers).toFixed(2)
      : "0.00";

  return (
    <>
      <SubscriptionsClientManager
        title="Subscriptions Management"
        description="Manage subscription tiers and pricing"
        onCreateClick={openCreateModal}
      >
        {/* First Child: Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <SubscriptionsStatCard
            icon={<SvgRevenue className="w-6 h-6" />}
            label="Total Revenue"
            value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
            borderColor="border-[#00A63E]"
            textColor="text-[#00A63E]"
            bgColor="bg-[#00A63E1A]"
          />
          <SubscriptionsStatCard
            icon={<SvgSubscribers className="w-6 h-6" />}
            label="Total Subscribers"
            value={(stats.totalUsers || 0).toLocaleString()}
            borderColor="border-[#155DFC]"
            textColor="text-[#155DFC]"
            bgColor="bg-[#155DFC1A]"
          />
          <SubscriptionsStatCard
            icon={<SvgActivePlans className="w-6 h-6" />}
            label="Active Subscriptions"
            value={(stats.activeSubscriptions || 0).toLocaleString()}
            borderColor="border-[#9810FA]"
            textColor="text-[#9810FA]"
            bgColor="bg-[#9810FA1A]"
          />
          <SubscriptionsStatCard
            icon={<SvgAvgRevenue className="w-6 h-6" />}
            label="Avg Revenue/User"
            value={`$${arpu}`}
            borderColor="border-[#D08700]"
            textColor="text-[#D08700]"
            bgColor="bg-[#D087001A]"
          />
        </div>

        <div className="flex flex-col gap-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Subscription Plans
          </h2>
          {plans.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">
                No plans found. Create your first plan to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan: any) => (
                <SubscriptionPlanCard
                  key={plan._id}
                  title={plan.name}
                  price={plan.price.toString()}
                  interval={plan.interval === "MONTH" ? "Monthly" : "Yearly"}
                  features={plan.features}
                  onEdit={() => openEditModal(plan)}
                  onDelete={() => initiateDelete(plan._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Third Child: Active Subscribers */}
        <div className="flex flex-col gap-6 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Active Subscribers
            </h2>
            <div className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 text-sm font-bold font-inter">
              Total: {subscriptions.length}
            </div>
          </div>
          <SubscriptionsTable data={subscriptions} />
        </div>
      </SubscriptionsClientManager>

      {modalState.isOpen && (
        <CreateSubscriptionPlanModal
          onClose={closeModal}
          initialData={modalState.initialData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteConfirm({ ...deleteConfirm, isOpen: false })
        }
      >
        <DialogContent className="max-w-[400px] p-8 bg-white rounded-3xl shadow-2xl border-none">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>

            <div className="flex flex-col gap-2 text-center">
              <DialogTitle className="text-stone-900 text-2xl font-bold font-roboto leading-tight text-center">
                Delete Plan?
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-base font-normal font-roboto leading-relaxed text-center">
                Are you sure you want to delete this subscription plan? This
                action cannot be undone.
              </DialogDescription>
            </div>

            <div className="flex flex-col w-full gap-3">
              <button
                disabled={isDeleting}
                onClick={handlePlanDelete}
                className="w-full py-4 bg-red-500 hover:bg-red-600 rounded-2xl text-white text-base font-bold font-roboto transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Permanently
              </button>
              <button
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, planId: null })
                }
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 text-base font-bold font-roboto transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

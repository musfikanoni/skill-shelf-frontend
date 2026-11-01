"use client";
import { useState } from "react";
import { 
  useGetAllCouponsQuery, 
  useCreateCouponMutation, 
  useUpdateCouponMutation 
} from "@/redux/api/userDashboardApi/couponApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import CouponsClientManager from "./CouponsClientManager";
import { CouponsStatCard } from "./CouponsStatCard";
import { CreateCouponForm } from "./CreateCouponForm";
import { CouponsTable } from "@/components/shared/coupons/CouponsTable";

export default function CouponsPage() {
  const { data: couponsData, isLoading: couponsLoading } = useGetAllCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const toggleForm = () => {
    if (isFormVisible) {
      setIsFormVisible(false);
      setEditingCoupon(null);
    } else {
      setIsFormVisible(true);
    }
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingCoupon(null);
  };

  const getInitialData = () => {
    if (!editingCoupon) return undefined;
    return {
      code: editingCoupon.code,
      discountType: editingCoupon.discountType,
      discountValue: editingCoupon.discountValue.toString(),
      minOrderAmount: editingCoupon.minOrderAmount.toString(),
      maxDiscountAmount: editingCoupon.maxDiscountAmount.toString(),
      expiresAt: new Date(editingCoupon.expiresAt),
    };
  };

  if (couponsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  const coupons = couponsData?.data || [];
  const activeCoupons = coupons.filter((c: any) => c.isActive).length;

  return (
    <>
      <CouponsClientManager
        title="Coupons"
        description="Create and manage discount coupons for your customers"
        onCreateClick={toggleForm}
        createButtonText={isFormVisible ? "Hide Form" : "Create Coupon"}
      >
        {/* First Child: Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <CouponsStatCard
            label="Total Coupons"
            value={coupons.length.toString()}
          />
          <CouponsStatCard
            label="Active Coupons"
            value={activeCoupons.toString()}
          />
          <CouponsStatCard
            label="Total Uses"
            value="0"
            valueColor="text-[#6C3FC5]"
          />
          <CouponsStatCard
            label="Revenue Impact"
            value="$0"
            valueColor="text-[#155DFC]"
          />
        </div>


        <div className="flex flex-col gap-6">
          {isFormVisible && (
            <CreateCouponForm
              onClose={handleCloseForm} 
              isEditing={!!editingCoupon}
              initialData={getInitialData()}
              onSuccess={async (data) => {
                try {
                  const payload = {
                    ...data,
                    discountValue: Number(data.discountValue),
                    minOrderAmount: Number(data.minOrderAmount),
                    maxDiscountAmount: Number(data.maxDiscountAmount),
                    expiresAt: data.expiresAt.toISOString(),
                  };

                  if (editingCoupon) {
                    await updateCoupon({ id: editingCoupon._id, data: payload }).unwrap();
                    toast.success("Coupon updated successfully!");
                  } else {
                    await createCoupon(payload).unwrap();
                    toast.success("Coupon created successfully!");
                  }
                  handleCloseForm();
                } catch (error: any) {
                  toast.error(error?.data?.message || "Failed to save coupon");
                }
              }}
            />
          )}
          <CouponsTable onEdit={handleEdit} data={coupons} />
        </div>
      </CouponsClientManager>
    </>
  );
}

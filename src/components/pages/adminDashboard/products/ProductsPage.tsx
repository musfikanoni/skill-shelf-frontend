"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AccessDenied } from "@/components/shared/auth/AccessDenied";
import { ProductsTable } from "@/components/shared/productsTable/ProductsTable";
import { CreateProductForm } from "./CreateProductForm";

export default function ProductsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { isAuthorized, isLoading: isAuthLoading } = useAdminAuth();

  const toggleForm = () => {
    if (isFormVisible) {
      setIsFormVisible(false);
      setEditingProduct(null);
    } else {
      setIsFormVisible(true);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const getInitialData = () => {
    if (!editingProduct) return undefined;

    const rawPrice = editingProduct.price;
    const isTiered = typeof rawPrice === 'object' && rawPrice !== null;

    return {
      id: editingProduct._id,
      name: editingProduct.name || '',
      description: editingProduct.description || '',
      category: editingProduct.category?._id || editingProduct.category || '',
      status: (editingProduct.status === 'active' || editingProduct.status === 'Active') ? 'Active' : 'Inactive' as "Active" | "Inactive",
      basicPrice: isTiered ? (rawPrice.basic ?? 0).toString() : (rawPrice ?? editingProduct.basicPrice ?? 0).toString(),
      proPrice: isTiered ? (rawPrice.pro ?? 0).toString() : (editingProduct.proPrice ?? 0).toString(),
      vipPrice: isTiered ? (rawPrice.vip ?? 0).toString() : (editingProduct.vipPrice ?? 0).toString(),
    };
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen -mt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1E293B]">Products</h1>
          <p className="text-slate-400 font-medium">
            View and manage all your products and inventory.
          </p>
        </div>
        <div>
          <Button
            onClick={toggleForm}
            className="cursor-pointer !h-14 px-8 border-0 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-slate-900 font-bold hover:opacity-90 transition-opacity rounded-[14px] shadow-none"
          >
            {isFormVisible ? (
              "Hide Form"
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add Products
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {isFormVisible && (
          <CreateProductForm
            onClose={handleCloseForm}
            isEditing={!!editingProduct}
            initialData={getInitialData()}
            onSuccess={() => {
              handleCloseForm();
            }}
          />
        )}
        <div className="sm:py-2">
          <ProductsTable onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}

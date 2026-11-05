"use client";

import React, { useState } from "react";
import BundlesClientManager from "./BundlesClientManager";
import { BundlesStatCard } from "./BundlesStatCard";
import { BundlesTable } from "./BundlesTable";
import { CreateBundleModal } from "./CreateBundleModal";
import { useGetAllBundlesQuery } from "@/redux/api/userDashboardApi/bundleApi";
import Loading from "@/components/Others/Loading";

export default function BundlesPage() {
  const { data: bundlesData, isLoading } = useGetAllBundlesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<any | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loading title="Loading Bundles" message="Fetching bundle catalog..." />
      </div>
    );
  }

  const bundles = bundlesData?.data || [];
  const totalBundles = bundles.length;
  const activeBundles = bundles.filter((b: any) => b.isActive !== false).length;

  const totalBundlePrice = bundles.reduce(
    (sum: number, b: any) => sum + (b.price || 0),
    0
  );
  const avgBundlePrice =
    totalBundles > 0 ? (totalBundlePrice / totalBundles).toFixed(0) : "0";

  const totalItemsBundled = bundles.reduce(
    (sum: number, b: any) =>
      sum + (b.products?.length || 0) + (b.courses?.length || 0),
    0
  );

  const handleOpenCreate = () => {
    setEditingBundle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bundle: any) => {
    setEditingBundle(bundle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBundle(null);
  };

  return (
    <>
      <BundlesClientManager
        title="Bundles"
        description="Create and manage curated product & course packages"
        onCreateClick={handleOpenCreate}
      >
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <BundlesStatCard
            label="Total Bundles"
            value={totalBundles.toString()}
            variant="slate"
          />
          <BundlesStatCard
            label="Active Bundles"
            value={activeBundles.toString()}
            variant="emerald"
          />
          <BundlesStatCard
            label="Avg Bundle Price"
            value={`$${avgBundlePrice}`}
            variant="purple"
          />
          <BundlesStatCard
            label="Total Items Bundled"
            value={totalItemsBundled.toString()}
            variant="yellow"
          />
        </div>

        {/* Table Section */}
        <BundlesTable onEdit={handleOpenEdit} />
      </BundlesClientManager>

      {/* Create / Edit Modal */}
      <CreateBundleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingBundle}
      />
    </>
  );
}

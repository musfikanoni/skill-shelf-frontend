"use client";

import React, { useState } from "react";
import { Search, Package, BookOpen, Layers, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAllBundlesQuery,
  useDeleteBundleMutation,
} from "@/redux/api/userDashboardApi/bundleApi";
import { SvgCourseEdit, SvgCourseDelete } from "@/lib/icons";
import Loading from "@/components/Others/Loading";
import { toast } from "sonner";

interface BundlesTableProps {
  onEdit?: (bundle: any) => void;
}

export const BundlesTable: React.FC<BundlesTableProps> = ({ onEdit }) => {
  const { data: bundlesData, isLoading } = useGetAllBundlesQuery();
  const [deleteBundle, { isLoading: isDeleting }] = useDeleteBundleMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bundleToDelete, setBundleToDelete] = useState<any | null>(null);

  const bundles = bundlesData?.data || [];

  const filteredBundles = React.useMemo(() => {
    let result = bundles;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b: any) =>
          b.name?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((b: any) =>
        b.isActive === undefined ? isActive : b.isActive === isActive,
      );
    }

    return result;
  }, [bundles, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!bundleToDelete) return;

    try {
      await deleteBundle(bundleToDelete._id).unwrap();
      toast.success("Bundle deleted successfully");
      setBundleToDelete(null);
    } catch (error: any) {
      console.error("Delete bundle error:", error);
      toast.error(error?.data?.message || "Failed to delete bundle");
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white rounded-2xl border border-slate-200">
        <Loading title="Loading Bundles" message="Fetching bundle catalog..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header filter controls */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search bundles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val: any) => setStatusFilter(val ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl bg-slate-50 border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-200">
              <TableHead className="font-bold text-slate-700 py-4 px-6">
                Bundle Details
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-4 px-6">
                Price
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-4 px-6">
                Products Included
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-4 px-6">
                Courses Included
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-4 px-6">
                Status
              </TableHead>
              <TableHead className="font-bold text-slate-700 py-4 px-6 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBundles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-10 h-10 text-slate-300" />
                    <p className="font-semibold text-slate-600">
                      No bundles found
                    </p>
                    <p className="text-sm text-slate-400">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Click 'Create Bundle' above to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBundles.map((bundle: any) => {
                const productsCount = bundle.products?.length || 0;
                const coursesCount = bundle.courses?.length || 0;
                const isActive = bundle.isActive !== false;

                return (
                  <TableRow
                    key={bundle._id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                  >
                    <TableCell className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {bundle.name}
                      </div>
                      {bundle.description && (
                        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {bundle.description}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-4 px-6 font-bold text-slate-900 text-base">
                      ${bundle.price?.toFixed(2) || "0.00"}
                    </TableCell>

                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 font-semibold"
                        >
                          <Package className="w-3 h-3" />
                          {productsCount} Product
                          {productsCount !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      {productsCount > 0 && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {bundle.products
                            ?.map((p: any) => p.name || "Product")
                            .slice(0, 2)
                            .join(", ")}
                          {productsCount > 2
                            ? ` +${productsCount - 2} more`
                            : ""}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1 font-semibold"
                        >
                          <BookOpen className="w-3 h-3" />
                          {coursesCount} Course{coursesCount !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      {coursesCount > 0 && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {bundle.courses
                            ?.map((c: any) => c.title || "Course")
                            .slice(0, 2)
                            .join(", ")}
                          {coursesCount > 2 ? ` +${coursesCount - 2} more` : ""}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-4 px-6">
                      <Badge
                        variant="outline"
                        className={
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                            : "bg-slate-100 text-slate-600 border-slate-200 font-semibold"
                        }
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit?.(bundle)}
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors group cursor-pointer"
                          title="Edit bundle"
                        >
                          <SvgCourseEdit />
                        </button>
                        <button
                          onClick={() => setBundleToDelete(bundle)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group cursor-pointer"
                          title="Delete bundle"
                        >
                          <SvgCourseDelete />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!bundleToDelete}
        onOpenChange={(open) => !open && setBundleToDelete(null)}
      >
        <DialogContent className="w-[92vw] max-w-[480px] bg-white rounded-[24px]! p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-6 pb-5">
            <div className="flex justify-between items-center mb-3">
              <DialogTitle className="text-[22px] font-bold text-[#0F172A] font-inter">
                Delete Bundle
              </DialogTitle>
            </div>
            <DialogDescription className="text-[#475569] text-base font-normal font-inter leading-normal">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                "{bundleToDelete?.name}"
              </span>
              ? This action can't be undone and this bundle package will be
              permanently removed.
            </DialogDescription>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          <div className="p-6 pt-5 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setBundleToDelete(null)}
              disabled={isDeleting}
              className="rounded-xl! border-2! border-slate-200! text-slate-700! font-bold text-sm px-6 h-11 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl! bg-[#E11D48]! hover:bg-[#BE123C]! text-white! font-bold text-sm px-6 h-11 border-none transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

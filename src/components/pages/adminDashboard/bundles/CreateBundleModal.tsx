"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllProductsQuery } from "@/redux/api/userDashboardApi/productApi";
import { useGetAllCoursesQuery } from "@/redux/api/userDashboardApi/courseApi";
import {
  useCreateBundleMutation,
  useUpdateBundleMutation,
} from "@/redux/api/userDashboardApi/bundleApi";
import { toast } from "sonner";
import { Loader2, X, Package, BookOpen, Sparkles } from "lucide-react";

interface CreateBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export const CreateBundleModal: React.FC<CreateBundleModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { data: productsData, isLoading: productsLoading } =
    useGetAllProductsQuery();
  const { data: coursesData, isLoading: coursesLoading } =
    useGetAllCoursesQuery();
  const [createBundle, { isLoading: isCreating }] = useCreateBundleMutation();
  const [updateBundle, { isLoading: isUpdating }] = useUpdateBundleMutation();

  const isSubmitting = isCreating || isUpdating;
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price !== undefined ? initialData.price.toString() : "");
      setIsActive(initialData.isActive !== false);

      const pIds = (initialData.products || []).map((p: any) =>
        typeof p === "string" ? p : p._id
      );
      setSelectedProductIds(pIds);

      const cIds = (initialData.courses || []).map((c: any) =>
        typeof c === "string" ? c : c._id
      );
      setSelectedCourseIds(cIds);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setIsActive(true);
      setSelectedProductIds([]);
      setSelectedCourseIds([]);
    }
  }, [initialData, isOpen]);

  const productsList = productsData?.data || [];
  const coursesList = coursesData?.data || [];

  const handleAddProduct = (productId: any) => {
    if (!productId || typeof productId !== "string") return;
    if (!selectedProductIds.includes(productId)) {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
  };

  const handleAddCourse = (courseId: any) => {
    if (!courseId || typeof courseId !== "string") return;
    if (!selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
  };

  const getItemPrice = (item: any) => {
    if (!item) return 0;
    if (typeof item.price === "number") return item.price;
    if (typeof item.price === "object") {
      return item.price?.basic || item.price?.pro || item.price?.vip || 0;
    }
    return 0;
  };

  const selectedProducts = productsList.filter((p: any) =>
    selectedProductIds.includes(p._id)
  );
  const selectedCourses = coursesList.filter((c: any) =>
    selectedCourseIds.includes(c._id)
  );

  const totalValue =
    selectedProducts.reduce((sum: number, p: any) => sum + getItemPrice(p), 0) +
    selectedCourses.reduce((sum: number, c: any) => sum + getItemPrice(c), 0);

  const numericPrice = parseFloat(price) || 0;
  const savings = Math.max(0, totalValue - numericPrice);
  const discountPercent =
    totalValue > 0 && numericPrice > 0
      ? Math.round((savings / totalValue) * 100)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Bundle name is required");
      return;
    }

    if (!price || numericPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (selectedProductIds.length === 0 && selectedCourseIds.length === 0) {
      toast.error("Please select at least one product or course for this bundle");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: numericPrice,
      products: selectedProductIds,
      courses: selectedCourseIds,
      isActive,
    };

    try {
      if (isEdit) {
        await updateBundle({ id: initialData._id, data: payload }).unwrap();
        toast.success("Bundle updated successfully!");
      } else {
        await createBundle(payload).unwrap();
        toast.success("Bundle created successfully!");
      }
      onClose();
    } catch (err: any) {
      console.error("Bundle operation error:", err);
      toast.error(err?.data?.message || `Failed to ${isEdit ? "update" : "create"} bundle`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[760px]! w-[92vw] p-0 bg-white rounded-2xl shadow-2xl border-none overflow-hidden flex flex-col max-h-[88vh] gap-0">
        {/* Pinned Header */}
        <DialogHeader className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-white shrink-0 pr-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <DialogTitle className="text-slate-900 text-xl font-bold font-inter text-left">
                {isEdit ? "Edit Bundle" : "Create New Bundle"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm font-normal text-left mt-0.5">
                {isEdit
                  ? "Update existing bundle contents, pricing, and details"
                  : "Combine multiple products and courses into a high-value package"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          {/* Scrollable Form Body with internal clean scrollbar */}
          <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1 space-y-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
            {/* Bundle Name & Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-stone-900 text-sm font-semibold font-inter text-left">
                  Bundle Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ultimate Web Dev & Design Master Pack"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-1 outline-gray-300 text-slate-900 text-sm font-inter focus:outline-amber-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-stone-900 text-sm font-semibold font-inter text-left whitespace-nowrap">
                  Bundle Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-1 outline-gray-300 text-slate-900 text-sm font-inter focus:outline-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-stone-900 text-sm font-semibold font-inter text-left">
                Description
              </label>
              <textarea
                placeholder="Describe what customers get in this bundle..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-1 outline-gray-300 text-slate-900 text-sm font-inter focus:outline-amber-500 resize-none transition-colors"
              />
            </div>

            {/* Products Selector */}
            <div className="flex flex-col gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-semibold flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-blue-600" />
                  Select Products
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedProductIds.length} Selected
                </span>
              </div>

              <Select onValueChange={(val: any) => handleAddProduct(val)}>
                <SelectTrigger className="w-full bg-white py-5 rounded-lg border-gray-300 text-slate-700">
                  <SelectValue
                    placeholder={
                      productsLoading ? "Loading products..." : "+ Add a product to bundle"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {productsList.map((prod: any) => {
                    const isSelected = selectedProductIds.includes(prod._id);
                    return (
                      <SelectItem
                        key={prod._id}
                        value={prod._id}
                        disabled={isSelected}
                      >
                        {prod.name} — ${getItemPrice(prod)} {isSelected ? "(Added)" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Selected Products Chips */}
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedProducts.map((prod: any) => (
                    <span
                      key={prod._id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold rounded-lg"
                    >
                      <span>{prod.name} (${getItemPrice(prod)})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod._id)}
                        className="text-blue-500 hover:text-red-500 transition-colors"
                        title="Remove product"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Courses Selector */}
            <div className="flex flex-col gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-800 font-semibold flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Select Courses
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedCourseIds.length} Selected
                </span>
              </div>

              <Select onValueChange={(val: any) => handleAddCourse(val)}>
                <SelectTrigger className="w-full bg-white py-5 rounded-lg border-gray-300 text-slate-700">
                  <SelectValue
                    placeholder={
                      coursesLoading ? "Loading courses..." : "+ Add a course to bundle"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {coursesList.map((course: any) => {
                    const isSelected = selectedCourseIds.includes(course._id);
                    return (
                      <SelectItem
                        key={course._id}
                        value={course._id}
                        disabled={isSelected}
                      >
                        {course.title} — ${getItemPrice(course)} {isSelected ? "(Added)" : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Selected Courses Chips */}
              {selectedCourses.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedCourses.map((course: any) => (
                    <span
                      key={course._id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold rounded-lg"
                    >
                      <span>{course.title} (${getItemPrice(course)})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(course._id)}
                        className="text-purple-500 hover:text-red-500 transition-colors"
                        title="Remove course"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing & Savings Breakdown */}
            {(selectedProductIds.length > 0 || selectedCourseIds.length > 0) && (
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-600 text-xs block">Total Item Value</span>
                    <span className="font-bold text-slate-900">${totalValue.toFixed(2)}</span>
                  </div>
                  <div className="h-6 w-px bg-amber-200" />
                  <div>
                    <span className="text-slate-600 text-xs block">Bundle Price</span>
                    <span className="font-bold text-slate-900">
                      {numericPrice > 0 ? `$${numericPrice.toFixed(2)}` : "—"}
                    </span>
                  </div>
                </div>
                {numericPrice > 0 && discountPercent > 0 && (
                  <div className="text-emerald-700 font-bold bg-emerald-100/90 px-3 py-1 rounded-md text-xs">
                    Customer Saves ${savings.toFixed(2)} ({discountPercent}% OFF)
                  </div>
                )}
              </div>
            )}

            {/* Active Status Checkbox */}
            <div className="flex items-center gap-3 pt-1">
              <Checkbox
                id="bundle-is-active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
              />
              <label
                htmlFor="bundle-is-active"
                className="text-sm font-medium text-slate-700 cursor-pointer select-none"
              >
                Active (Visible and available for purchase on website)
              </label>
            </div>
          </div>

          {/* Pinned Footer (Action Buttons) */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-6 h-11 text-slate-700 border-slate-300 hover:bg-slate-100 font-medium cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg px-8 h-11 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black hover:from-[#F9C32C] hover:to-[#EFA00B] font-bold cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Bundle"
              ) : (
                "Create Bundle"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

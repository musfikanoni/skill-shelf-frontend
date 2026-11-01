"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from "@/redux/api/userDashboardApi/categoryApi";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Category, CategoryTable } from "@/components/shared/categories/CategoryTable";
import CategoryModal from "./AddCategoryModal";
import DeleteModal from "@/components/shared/modals/DeleteModal";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const categories = useMemo(() => {
    return categoriesData?.data?.map((cat: any) => ({
      id: cat._id,
      name: cat.name,
      categoryId: cat._id.slice(-6).toUpperCase(), 
    })) || [];
  }, [categoriesData]);

  const handleExport = () => {
    if (categories.length === 0) {
      toast.error("No categories to export");
      return;
    }

    try {
      const exportData = categories.map((cat: Category) => ({
        "Category Name": cat.name,
        "Category ID": cat.categoryId,
        "System ID": cat.id
      }));


      const ws = XLSX.utils.json_to_sheet(exportData);
      

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Categories");

 
      const wscols = [
        { wch: 30 },
        { wch: 15 }, 
        { wch: 30 }  
      ];
      ws['!cols'] = wscols;


      const fileName = `Categories_Export_${new Date().toISOString().split('T')[0]}.xlsx`;


      XLSX.writeFile(wb, fileName);
      toast.success("Excel file exported successfully");
    } catch (error) {
      toast.error("Failed to export Excel file");
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id as string).unwrap();
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ... existing header ... */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1E293B]">Categories</h1>
          <p className="text-slate-400 font-medium">Manage all categories</p>
        </div>
        <div className="lg:flex md:flex-row gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            className="py-5 cursor-pointer px-4 text-[15px] font-semibold shadow-sm"
            disabled={categories.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer py-5 px-7 border-0 flex-1 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black  hover:from-[#F9C32C] hover:to-[#EFA00B] hover:text-black"
          >
            <Plus className="h-4 w-4 " />
            Add Category
          </Button>
        </div>
      </div>

      <div className="sm:py-6 lg:py-8">
        <CategoryTable
          data={categories}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CategoryModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseModal} 
        initialData={selectedCategory}
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Category"
        description={`Are you sure you want to delete the category "${categoryToDelete?.name}"? All products under this category will be affected.`}
      />
    </div>
  );
}

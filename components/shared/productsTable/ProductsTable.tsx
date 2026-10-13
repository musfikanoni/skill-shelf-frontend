'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Search, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { cn } from "@/lib/utils";
import { useDeleteProductMutation, useGetAllProductsQuery } from '@/redux/api/userDashboardApi/productApi';

const ITEMS_PER_PAGE = 8;

interface ProductsTableProps {
  onEdit?: (product: any) => void;
}

export function ProductsTable({ onEdit }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const router = useRouter();
  const { isAuthorized, isLoading: isAuthLoading } = useAdminAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthorized) {
      toast.error('Unauthorized access. Please login.');
      router.push('/signIn');
    }
  }, [isAuthorized, isAuthLoading, router]);

  const { data: response, isLoading: isDataLoading, isError } = useGetAllProductsQuery(undefined, {
    skip: !isAuthorized
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = useMemo(() => {
    if (!response?.data) return [];
    return response.data.map((p: any) => ({
      ...p,
      id: p._id,
      name: p.name,
      categoryName: p.category?.name || 'Uncategorized',
      basicPrice: typeof p.price === 'number' ? p.price : (p.price?.basic || 0),
      proPrice: typeof p.price === 'number' ? 0 : (p.price?.pro || 0),
      vipPrice: typeof p.price === 'number' ? 0 : (p.price?.vip || 0),
      displayStatus: 'active'
    }));
  }, [response]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p: any) => p.categoryName));
    return Array.from(cats);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (product: any) => {
    if (onEdit) {
      onEdit(product);
    } else {
      console.log('Edit product:', product.id);
    }
  };

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    try {
      await deleteProduct(idToDelete).unwrap();
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const isLoading = isDataLoading || isAuthLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-white rounded-lg border shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-white rounded-lg border text-red-500 font-medium">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] outline-2 outline-offset-[-2px] outline-slate-200 flex flex-col w-full overflow-hidden">
      {/* Header */}
      <div className="self-stretch h-24 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-20">
        <div className="text-slate-900 text-xl font-bold font-inter leading-7">
          All Products
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="w-[400px] !h-14 px-4 py-2 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center gap-2 bg-white">
            <Search className="w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 bg-transparent outline-none text-slate-700 text-base font-medium font-inter placeholder:text-slate-700/50"
            />
          </div>

          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value ?? 'all');
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-48 !h-14 px-3 py-2 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 flex justify-between items-center bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent sideOffset={6} className="rounded-lg">
              <SelectItem value="all" className="py-2 px-4">All Categories</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category} value={category} className="py-2 px-4">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto min-h-[480px]">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow className="h-14 border-b border-slate-200">
              <TableHead className="pl-6 pr-3 py-3 font-bold text-slate-900 text-start">Product Name</TableHead>
              <TableHead className="px-6 font-bold text-slate-900 text-start">Category</TableHead>
              <TableHead className="px-6 font-bold text-slate-900 text-start">Basic Price</TableHead>
              <TableHead className="px-6 font-bold text-slate-900 text-start">Pro Price</TableHead>
              <TableHead className="px-6 font-bold text-slate-900 text-start">VIP Price</TableHead>
              <TableHead className="px-6 font-bold text-slate-900 text-start">Status</TableHead>
              <TableHead className="px-6 font-bold text-slate-900 text-start">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product: any) => (
                <TableRow
                  key={product.id}
                  className="h-16 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="px-6">
                    <div className="text-slate-900 text-base font-bold font-inter leading-6 line-clamp-1">
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-slate-600 text-sm font-medium font-inter">
                      {product.categoryName}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-slate-900 text-base font-bold font-inter">
                      ${product.basicPrice.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-slate-900 text-base font-bold font-inter">
                      {product.proPrice > 0 ? `$${product.proPrice.toLocaleString()}` : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-slate-900 text-base font-bold font-inter">
                      {product.vipPrice > 0 ? `$${product.vipPrice.toLocaleString()}` : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex justify-start">
                      <div className="h-7 px-3 py-1 bg-emerald-100 rounded-[10px] flex justify-center items-center">
                        <span className="text-emerald-700 text-sm font-bold font-inter leading-5">active</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-purple-50 rounded-[10px] transition-colors"
                        title="Edit"
                      >
                        <SquarePen className="w-5 h-5 text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                        className="w-9 h-9 flex items-center justify-center hover:bg-red-50 rounded-[10px] transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-inter">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="h-20 px-6 border-t border-slate-200 flex items-center justify-between bg-white">
        <div className="text-slate-500 text-sm font-medium font-inter">
          Showing {paginatedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="!h-10 rounded-lg border-slate-300 text-slate-700 font-bold"
          >
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "!h-10 w-10 p-0 rounded-lg font-bold",
                  currentPage === page
                    ? "bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black border-none"
                    : "border-slate-300 text-slate-700"
                )}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="!h-10 rounded-lg border-slate-300 text-slate-700 font-bold"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
          <div className="p-8 space-y-6">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-[#0F172A] leading-tight">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-base font-medium leading-relaxed">
                Are you sure you want to delete this product? This action is permanent and cannot be reversed.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
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
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

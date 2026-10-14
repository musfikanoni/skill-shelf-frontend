'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  SquarePen,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

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
import { toast } from 'sonner';
import { useDeleteCouponMutation } from '@/redux/api/userDashboardApi/couponApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Coupon {
  _id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  expiresAt: string;
  isActive: boolean;
}

interface CouponsTableProps {
  data: Coupon[];
  onEdit?: (coupon: Coupon) => void;
}

export function CouponsTable({ data = [], onEdit }: CouponsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coupon; direction: 'asc' | 'desc' } | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter and Sort coupons
  const filteredCoupons = useMemo(() => {
    let result = data.filter((coupon) => {
      const matchesSearch = coupon.code
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const status = coupon.isActive ? 'active' : 'expired';
      const matchesStatus =
        selectedStatus === 'all' ||
        status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, debouncedSearch, selectedStatus, sortConfig]);

  const handleSort = (key: keyof Coupon) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const handleEdit = (coupon: Coupon) => {
    if (onEdit) {
      onEdit(coupon);
    } else {
      console.log('Edit coupon:', coupon._id);
    }
  };

  const handleDelete = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (couponToDelete) {
      try {
        await deleteCoupon(couponToDelete._id).unwrap();
        toast.success(`Coupon "${couponToDelete.code}" deleted successfully`);
        setIsDeleteDialogOpen(false);
        setCouponToDelete(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete coupon");
      }
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code "${code}" copied to clipboard`);
  };

  return (
    <div className="self-stretch h-[420px] bg-white rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] outline-2 outline-offset-[-2px] outline-slate-200 inline-flex flex-col justify-start items-start w-full overflow-hidden">
      {/* Header */}
      <div className="self-stretch h-24 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-20">
        <div className="text-slate-900 text-xl font-bold font-inter leading-7">
          All Coupons
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="w-[500px] !h-14 px-4 py-2 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center gap-2 bg-white">
            <Search className="w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search Coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-700 text-base font-medium font-inter placeholder:text-slate-700/50"
            />
          </div>

          {/* Filter */}
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value ?? 'all')}>
            <SelectTrigger className="w-36 !h-14 px-3 py-2 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 flex justify-between items-center bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent sideOffset={6} className="rounded-lg">
              <SelectItem value="all" className="py-2 px-4">All Status</SelectItem>
              <SelectItem value="active" className="py-2 px-4">Active</SelectItem>
              <SelectItem value="expired" className="py-2 px-4">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      <div className="self-stretch flex-1 w-full overflow-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="h-14 bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
              <TableHead
                className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center gap-2">
                  Code
                  {sortConfig?.key === 'code' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('discountType')}
              >
                <div className="flex items-center gap-2">
                  Type
                  {sortConfig?.key === 'discountType' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap text-center cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('discountValue')}
              >
                <div className="flex items-center justify-center gap-2">
                  Discount
                  {sortConfig?.key === 'discountValue' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap text-center cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('minOrderAmount')}
              >
                <div className="flex items-center justify-center gap-2">
                  Min/Max Amount
                  {sortConfig?.key === 'minOrderAmount' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap text-center cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('expiresAt')}
              >
                <div className="flex items-center justify-center gap-2">
                  Expiry Date
                  {sortConfig?.key === 'expiresAt' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap text-center cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('isActive')}
              >
                <div className="flex items-center justify-center gap-2">
                  Status
                  {sortConfig?.key === 'isActive' ? (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronsUpDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-6 text-slate-700 text-base font-bold font-inter leading-6 whitespace-nowrap text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <TableRow key={coupon._id} className="h-16 border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 text-sm font-semibold font-dm-sans leading-4 tracking-wide">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors group"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-slate-900 text-base font-bold font-inter leading-6">
                      {coupon.discountType}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex justify-center">
                      <div className="h-7 px-3 py-1 bg-purple-100 rounded-[10px] flex justify-center items-center">
                        <span className="text-purple-700 text-sm font-bold font-inter leading-5">
                          {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-center text-slate-900 text-base font-semibold font-inter leading-6">
                      Min: ${coupon.minOrderAmount} / Max: ${coupon.maxDiscountAmount}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="text-center text-slate-600 text-base font-normal font-inter leading-6 whitespace-nowrap">
                      {format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex justify-center">
                      <div className={`h-7 px-3 py-1 rounded-[10px] flex justify-center items-center ${coupon.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                        <span className="text-sm font-bold font-inter leading-5">{coupon.isActive ? 'Active' : 'Expired'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-purple-50 rounded-[10px] transition-colors"
                        title="Edit"
                      >
                        <SquarePen className="w-5 h-5 text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-red-50 rounded-[10px] transition-colors"
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
                  No coupons found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Section (Pagination removed) */}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-[650px] p-0 overflow-hidden rounded-lg border-none shadow-2xl">
          <div className="p-6 pt-7">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="text-2xl font-bold text-[#1E293B] tracking-tight">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-[#64748B] text-base font-medium leading-relaxed">
                Are you sure you want to delete the coupon <span className="text-slate-900 font-bold">"{couponToDelete?.code}"</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="border-t border-slate-100 bg-[#F8FAFC] p-4 px-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-full px-8 h-12 border-slate-200 text-slate-700 text-base font-bold hover:bg-white hover:border-slate-300 transition-all shadow-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-[#EF4444] hover:bg-red-600 text-white rounded-full px-8 h-12 text-base font-bold transition-all shadow-[0_4px_12px_rgba(239,68,68,0.25)] flex items-center gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Coupon
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
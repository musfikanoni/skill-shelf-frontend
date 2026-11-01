'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

const formSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.string().min(1, 'Discount value is required'),
  minOrderAmount: z.string().min(1, 'Minimum order amount is required'),
  maxDiscountAmount: z.string().min(1, 'Maximum discount amount is required'),
  expiresAt: z.date({
    message: "Expiry date is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCouponFormProps {
  onClose: () => void;
  onSuccess: (data: FormValues) => void;
  initialData?: FormValues;
  isEditing?: boolean;
}

export function CreateCouponForm({ onClose, onSuccess, initialData, isEditing = false }: CreateCouponFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '0',
      maxDiscountAmount: '0',
      expiresAt: new Date(),
    },
  });

  const onSubmit = (data: FormValues) => {
    onSuccess(data);
    toast.success(isEditing ? 'Coupon updated successfully!' : 'Coupon created successfully!');
    form.reset();
  };

  return (
    <div className="self-stretch p-8 bg-white rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] outline-2 outline-offset-[-2px] outline-slate-200 flex flex-col gap-6 w-full animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center h-10">
        <h2 className="text-slate-900 text-2xl font-bold font-inter leading-8">
          {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-slate-50 transition-colors"
        >
          <X className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            
            {/* Coupon Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Coupon Code</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center bg-white focus-within:outline-amber-500">
                      <input
                        {...field}
                        placeholder="e.g., SAVE10"
                        className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-dm-sans placeholder:text-neutral-950/30"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full !h-14 px-4 py-3 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 text-slate-900 text-base font-medium font-dm-sans focus:border-amber-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent sideOffset={6} className="rounded-lg">
                      <SelectItem value="PERCENTAGE" className="py-2 px-4">Percentage</SelectItem>
                      <SelectItem value="FIXED" className="py-2 px-4">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Value */}
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Discount Value</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center bg-white focus-within:outline-amber-500">
                      <input
                        {...field}
                        type="number"
                        placeholder="e.g., 10"
                        className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-dm-sans placeholder:text-neutral-950/30"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Min Order Amount */}
            <FormField
              control={form.control}
              name="minOrderAmount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Min Order Amount ($)</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center bg-white focus-within:outline-amber-500">
                      <input
                        {...field}
                        type="number"
                        placeholder="e.g., 100"
                        className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-dm-sans placeholder:text-neutral-950/30"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Discount Amount */}
            <FormField
              control={form.control}
              name="maxDiscountAmount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Max Discount Amount ($)</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center bg-white focus-within:outline-amber-500">
                      <input
                        {...field}
                        type="number"
                        placeholder="e.g., 50"
                        className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-dm-sans placeholder:text-neutral-950/30"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Expiry Date</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger
                        className={cn(
                          "!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex justify-between items-center bg-white group cursor-pointer w-full focus:outline-amber-500",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="text-slate-900 text-lg font-medium font-roboto leading-6">
                          {field.value ? (
                            format(field.value, "dd-MM-yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </span>
                        <CalendarIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0 rounded-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex items-end justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 !h-14 rounded-[14px] border-2 border-[#CAD5E2] shadow-none text-slate-700 text-base font-bold font-inter bg-transparent hover:bg-slate-50 transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ background: 'linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)' }}
                className="flex-1 !h-14 rounded-[14px] border-none shadow-none text-slate-900 text-base font-bold font-inter hover:opacity-90 transition-opacity"
              >
                {isEditing ? 'Update Coupon' : 'Create Coupon'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

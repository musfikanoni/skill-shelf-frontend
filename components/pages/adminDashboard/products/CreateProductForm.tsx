'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Upload, DollarSign, FileText, Loader2 } from 'lucide-react';
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
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useCreateProductMutation, useUpdateProductMutation } from '@/redux/api/userDashboardApi/productApi';

const formSchema = z.object({
  name: z.string().min(1, 'Product title is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['Active', 'Inactive']),
  quantity: z.string().min(1, 'Quantity is required'),
  basicPrice: z.string().min(1, 'Basic price is required'),
  proPrice: z.string().min(1, 'Pro price is required'),
  vipPrice: z.string().min(1, 'VIP price is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any; 
  isEditing?: boolean;
}

export function CreateProductForm({ onClose, onSuccess, initialData, isEditing = false }: CreateProductFormProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [images, setImages] = useState<File[]>([]);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingPdfs, setExistingPdfs] = useState<{name: string, url: string}[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category?._id || initialData?.category || '69ec7abc558abbabebfce3db',
      status: initialData?.status || 'Active',
      quantity: String(initialData?.quantity || '0'),
      basicPrice: String(initialData?.price?.basic || initialData?.basicPrice || '0.00'),
      proPrice: String(initialData?.price?.pro || initialData?.proPrice || '0.00'),
      vipPrice: String(initialData?.price?.vip || initialData?.vipPrice || '0.00'),
    },
  });

  // Populate existing assets on edit
  React.useEffect(() => {
    if (isEditing && initialData) {
      if (initialData.images) setExistingImages(initialData.images);
      
      const pdfs: {name: string, url: string}[] = [];
      if (initialData.files?.basic) pdfs.push({ name: 'Basic PDF', url: initialData.files.basic });
      if (initialData.files?.pro) pdfs.push({ name: 'Pro PDF', url: initialData.files.pro });
      if (initialData.files?.vip) pdfs.push({ name: 'VIP PDF', url: initialData.files.vip });
      setExistingPdfs(pdfs);
    }
  }, [isEditing, initialData]);

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('quantity', values.quantity);
      formData.append('price[basic]', values.basicPrice);
      formData.append('price[pro]', values.proPrice);
      formData.append('price[vip]', values.vipPrice);
      formData.append('status', values.status.toLowerCase());

      if (images.length > 0) {
        formData.append('images', images[0]);
      }

      if (pdfFiles.length > 0) {
        formData.append('basicFile', pdfFiles[0]);
        if (pdfFiles[1]) formData.append('proFile', pdfFiles[1]);
        if (pdfFiles[2]) formData.append('vipFile', pdfFiles[2]);
      }

      if (isEditing && initialData?.id) {
        await updateProduct({ id: initialData.id, data: formData }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct(formData).unwrap();
        toast.success('Product created successfully!');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    const newImages = fileArray.filter(file => file.type.startsWith('image/'));
    const newPdfs = fileArray.filter(file => file.type === 'application/pdf');

    if (images.length + newImages.length > 1) {
      toast.error('Maximum 1 image allowed');
      return;
    }

    if (pdfFiles.length + newPdfs.length > 3) {
      toast.error('Maximum 3 PDF files allowed');
      return;
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
    }
    if (newPdfs.length > 0) {
      setPdfFiles(prev => [...prev, ...newPdfs]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removePdf = (index: number) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPdf = (index: number) => {
    setExistingPdfs(prev => prev.filter((_, i) => i !== index));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="self-stretch p-8 bg-white rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] outline-2 outline-offset-[-2px] outline-slate-200 flex flex-col gap-6 w-full animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center h-10">
        <h2 className="text-slate-900 text-2xl font-bold font-inter leading-8">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          disabled={isLoading}
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-[10px] hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <X className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

            {/* Product Title */}
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Product Title</FormLabel>
                    <FormControl>
                      <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center bg-white">
                        <input
                          {...field}
                          disabled={isLoading}
                          placeholder="Enter product title"
                          className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-inter placeholder:text-neutral-950/30"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="w-full !h-14 px-4 py-3 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 text-slate-900 text-base font-medium font-roboto">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent sideOffset={6} className="rounded-lg">
                      <SelectItem value="69ec7abc558abbabebfce3db" className="py-2 px-4">Course</SelectItem>
                      <SelectItem value="69ec7ac8558abbabebfce3dd" className="py-2 px-4">Digital Product</SelectItem>
                      <SelectItem value="69ec5ba2afc1f2b9277ae6f5" className="py-2 px-4">Template</SelectItem>
                      <SelectItem value="69ec7ad4558abbabebfce3df" className="py-2 px-4">ebook</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Quantity</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center bg-white">
                      <input
                        {...field}
                        type="number"
                        disabled={isLoading}
                        placeholder="0"
                        className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-inter placeholder:text-neutral-950/30"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-2 md:col-span-2 lg:col-span-1">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="w-full !h-14 px-4 py-3 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 text-slate-900 text-base font-medium font-roboto">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent sideOffset={6} className="rounded-lg">
                      <SelectItem value="Active" className="py-2 px-4">Active</SelectItem>
                      <SelectItem value="Inactive" className="py-2 px-4">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prices */}
            <FormField
              control={form.control}
              name="basicPrice"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Basic Price ($)</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center justify-between bg-white">
                      <input {...field} disabled={isLoading} placeholder="0.00" className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-roboto" />
                      <DollarSign className="w-5 h-5 text-slate-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proPrice"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">Pro Price ($)</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center justify-between bg-white">
                      <input {...field} disabled={isLoading} placeholder="0.00" className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-roboto" />
                      <DollarSign className="w-5 h-5 text-slate-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vipPrice"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter block mb-2">VIP Price ($)</FormLabel>
                  <FormControl>
                    <div className="!h-14 px-4 py-3 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center justify-between bg-white">
                      <input {...field} disabled={isLoading} placeholder="0.00" className="w-full bg-transparent outline-none text-slate-900 text-base font-medium font-roboto" />
                      <DollarSign className="w-5 h-5 text-slate-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Section */}
            <div className="md:col-span-2 space-y-4">
              <FormLabel className="text-slate-700 text-base font-semibold font-inter block">Product Assets (Images & PDF)</FormLabel>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "min-h-[160px] border-dashed border-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all gap-3 p-6",
                  isDragging ? "border-blue-500 bg-blue-50/50" : "border-slate-300 hover:bg-slate-50",
                  (images.length > 0 || pdfFiles.length > 0) ? "bg-slate-50/30" : ""
                )}
              >
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-bold text-lg">Click or drag to upload</p>
                  <p className="text-slate-500 text-sm font-medium">1 Image & Max 3 PDFs allowed</p>
                </div>
              </div>

              {/* File Previews */}
              {(images.length > 0 || pdfFiles.length > 0 || existingImages.length > 0 || existingPdfs.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                  {existingImages.map((url, index) => (
                    <div key={`exist-img-${index}`} className="group relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                      <img src={url} alt="existing product" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.map((file, index) => (
                    <div key={`img-${index}`} className="group relative aspect-square rounded-lg border-2 border-emerald-400 overflow-hidden bg-white shadow-sm">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {existingPdfs.map((file, index) => (
                    <div key={`exist-pdf-${index}`} className="group relative aspect-square rounded-lg border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 p-3 shadow-sm">
                      <FileText className="w-10 h-10 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 text-center line-clamp-2 uppercase tracking-tight">{file.name}</span>
                      <button type="button" onClick={() => removeExistingPdf(index)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="mt-1 px-2 py-0.5 bg-slate-500 text-white text-[9px] font-black rounded uppercase">Existing</div>
                    </div>
                  ))}
                  {pdfFiles.map((file, index) => (
                    <div key={`pdf-${index}`} className="group relative aspect-square rounded-lg border-2 border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center gap-2 p-3 shadow-sm">
                      <FileText className="w-10 h-10 text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-800 text-center line-clamp-2 uppercase tracking-tight">{file.name}</span>
                      <button type="button" onClick={() => removePdf(index)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="mt-1 px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded uppercase">PDF {index + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex items-center gap-3 pt-6">
              <Button type="button" variant="outline" disabled={isLoading} onClick={onClose} className="w-32 !h-14 rounded-[14px] border-2 border-[#CAD5E2] shadow-none text-slate-700 text-base font-bold font-inter bg-transparent hover:bg-slate-50 transition-all">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} style={{ background: 'linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)' }} className="w-56 !h-14 rounded-[14px] border-none shadow-none text-slate-900 text-base font-bold font-inter hover:opacity-90 transition-opacity">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

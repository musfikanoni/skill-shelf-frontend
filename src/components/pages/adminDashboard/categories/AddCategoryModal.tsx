import React, { useState, useEffect } from 'react';
import { X, CloudUpload, Loader2 } from 'lucide-react';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/redux/api/userDashboardApi/categoryApi';
import { toast } from 'sonner';
import { Category } from '@/components/shared/categories/CategoryTable';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Category | null;
}

const CategoryModal = ({ isOpen, onClose, initialData }: CategoryModalProps) => {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isEdit = !!initialData;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
      setImage(null);
      setPreview(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (image) {
        formData.append('files', image);
      }

      if (isEdit && initialData) {
        await updateCategory({ id: initialData.id as string, data: formData }).unwrap();
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData).unwrap();
        toast.success('Category created successfully');
      }
      
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} category`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white rounded-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-medium text-[#1e293b]">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {/* Category Name Input */}
          <div className="space-y-2">
            <label className="block text-[15px] font-medium text-[#1e293b]">
              Category Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. UI Kits"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:bg-slate-50 font-medium"
            />
          </div>

          {/* Upload Section */}
          <div className="space-y-2">
            <label className="block text-[15px] font-medium text-[#1e293b]">
              Icon or Image (Optional)
            </label>
            
            {preview ? (
              <div className="relative w-full aspect-video rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 group">
                <img src={preview} alt="Category preview" className="w-full h-full object-contain p-4" />
                <button 
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-600 transition-all text-slate-600"
                >
                  <X size={18} />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-slate-900/40 backdrop-blur-[2px] py-2 text-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Click the X to change image
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-slate-50 hover:border-amber-400 transition-all cursor-pointer group"
              >
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform group-hover:border-amber-200 group-hover:bg-amber-50">
                  <CloudUpload className="text-amber-500" size={28} />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {isEdit ? 'Change Category Icon' : 'Upload Category Icon'}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  SVG, PNG, JPG (max. 2MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-sm font-bold text-[#1e293b] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-8 py-2.5 text-sm font-bold text-[#1e293b] bg-gradient-to-b from-[#ffcc33] to-[#f3b005] rounded-lg hover:opacity-90 shadow-[0px_4px_10px_0px_rgba(245,197,24,0.3)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Category' : 'Save Category')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CategoryModal;
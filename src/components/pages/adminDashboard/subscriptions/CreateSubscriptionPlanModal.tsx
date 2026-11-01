import React from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SvgPricingHeader, SvgPricingCreate } from "@/lib/icons";
import { useGetAllProductsQuery } from "@/redux/api/userDashboardApi/productApi";
import { useGetAllCoursesQuery } from "@/redux/api/userDashboardApi/courseApi";
import { useGetBundlesQuery } from "@/redux/api/landingPageApi/LandingPageApi";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/redux/api/userDashboardApi/subscriptionApi";

const formSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  price: z.string().min(1, "Price is required"),
  interval: z.enum(["MONTH", "YEAR"]),
  status: z.string(),
  features: z.array(z.object({ value: z.string().min(1, "Feature is required") })),
  access: z.object({
    products: z.array(z.object({
      product: z.string().min(1, "Product is required"),
      fileAccess: z.string().min(1, "Access level is required")
    })),
    courses: z.array(z.object({ value: z.string().min(1, "Course is required") })),
    bundles: z.array(z.object({ value: z.string().min(1, "Bundle is required") }))
  })
});

type FormValues = z.infer<typeof formSchema>;


interface CreateSubscriptionPlanModalProps {
  onClose: () => void;
  initialData?: any; 
}

export const CreateSubscriptionPlanModal: React.FC<CreateSubscriptionPlanModalProps> = ({ 
  onClose,
  initialData 
}) => {
  const isEdit = !!initialData;
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  
  const { data: productsData } = useGetAllProductsQuery();
  const { data: coursesData } = useGetAllCoursesQuery();
  const { data: bundlesData } = useGetBundlesQuery({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      planName: initialData.name,

      price: initialData.price.toString(),
      interval: initialData.interval,
      status: initialData.isActive ? "active" : "deactivate",
      features: initialData.features.map((f: string) => ({ value: f })),
      access: {
        products: initialData.access?.products || [],
        courses: initialData.access?.courses?.map((c: string) => ({ value: c })) || [],
        bundles: initialData.access?.bundles?.map((b: string) => ({ value: b })) || []
      }
    } : {
      planName: "",

      price: "",
      interval: "MONTH",
      status: "active",
      features: [{ value: "" }],
      access: {
        products: [],
        courses: [],
        bundles: []
      }
    },
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
    control: form.control,
    name: "access.products",
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: "access.courses",
  });

  const { fields: bundleFields, append: appendBundle, remove: removeBundle } = useFieldArray({
    control: form.control,
    name: "access.bundles",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formattedData = {
        name: data.planName,
        price: Number(data.price),
        currency: "usd",
        interval: data.interval,
        features: data.features.map(f => f.value),
        isActive: data.status === "active",
        access: {
          products: data.access.products,
          courses: data.access.courses.map(c => c.value),
          bundles: data.access.bundles.map(b => b.value)
        }
      };

      if (isEdit) {
        await updatePlan({ id: initialData._id, data: formattedData }).unwrap();
        toast.success("Subscription plan updated successfully!");
      } else {
        await createPlan(formattedData).unwrap();
        toast.success("Subscription plan created successfully!");
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save subscription plan");
    }
  };


  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[750px]! p-6 bg-white rounded-2xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.10)] border-none gap-6 overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        <DialogHeader className="gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-amber-500/10 rounded-full flex items-center justify-center">
              <SvgPricingHeader className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <DialogTitle className="text-stone-900 text-lg font-semibold font-roboto leading-5 border-none">
              {isEdit ? "Edit Subscription Plan" : "Create New Subscription Plan"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 text-base font-normal font-roboto leading-6 text-left">
            {isEdit ? "Update existing subscription tier details" : "Add a new subscription tier to the platform"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-stone-900 text-base font-medium font-inter text-left">
                Plan Name <span className="text-red-600">*</span>
              </label>
              <input
                {...form.register("planName")}
                type="text"
                placeholder="e.g., Pro, Vip..."
                className="w-full px-4 py-3.5 bg-gray-100 rounded-md outline-1 outline-gray-300 text-slate-900 text-sm font-normal font-inter focus:outline-amber-500"
              />
              {form.formState.errors.planName && (
                <span className="text-red-500 text-xs">{form.formState.errors.planName.message}</span>
              )}
            </div>



            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-stone-900 text-base font-medium font-inter text-left">
                  Price ($) <span className="text-red-600">*</span>
                </label>
                <input
                  {...form.register("price")}
                  type="text"
                  placeholder="29"
                  className="w-full px-4 py-3.5 bg-gray-100 rounded-md outline-1 outline-gray-300 text-slate-900 text-sm font-normal font-inter focus:outline-amber-500"
                />
                {form.formState.errors.price && (
                  <span className="text-red-500 text-xs">{form.formState.errors.price.message}</span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-stone-900 text-base font-medium font-inter text-left">
                  Billing Interval <span className="text-red-600">*</span>
                </label>
                <Select
                  onValueChange={(val) => form.setValue("interval", val as "MONTH" | "YEAR")}
                  defaultValue={form.getValues("interval")}
                >
                  <SelectTrigger className="w-full px-4 py-3.5 h-[52px]! bg-gray-100 rounded-md outline-1 outline-gray-300 text-slate-900 text-sm font-normal font-inter focus:outline-amber-500 border-none shadow-none">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent className="w-(--radix-select-trigger-width)" sideOffset={1}>
                    <SelectItem value="MONTH" className="py-3! pl-4!">Monthly</SelectItem>
                    <SelectItem value="YEAR" className="py-3! pl-4!">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-stone-900 text-base font-medium font-inter text-left">Status</label>
              <Select
                onValueChange={(val) => form.setValue("status", val ?? "active")}
                defaultValue={form.getValues("status")}
              >
                <SelectTrigger className="w-full px-4 py-3.5 h-[52px]! bg-gray-100 rounded-md outline-1 outline-gray-300 text-slate-900 text-sm font-normal font-inter focus:outline-amber-500 border-none shadow-none">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="w-(--radix-select-trigger-width)" sideOffset={1}>
                  <SelectItem value="active" className="py-3! pl-4!">Active</SelectItem>
                  <SelectItem value="deactivate" className="py-3! pl-4!">Deactivate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features List */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-stone-900 text-base font-medium font-inter">
                Plan Features <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => appendFeature({ value: "" })}
                className="px-3 py-2 rounded-md outline-1 outline-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Plus size={20} className="text-stone-900" />
                <span className="text-stone-900 text-base font-medium font-roboto">Add Feature</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {featureFields.map((field, index) => (
                <div key={field.id} className="flex gap-3.5 items-center">
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      {...form.register(`features.${index}.value` as const)}
                      type="text"
                      placeholder="Enter feature description..."
                      className="w-full px-4 py-3.5 bg-gray-100 rounded-md outline-1 outline-gray-300 text-slate-900 text-sm font-normal font-inter focus:outline-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-3.5 bg-gray-100 rounded-md outline-1 outline-gray-300 hover:bg-red-50 text-red-600 shrink-0 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Access Control: Products */}
          <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-stone-900 text-base font-bold font-inter">
                Product Access
              </label>
              <button
                type="button"
                onClick={() => appendProduct({ product: "", fileAccess: "basic" })}
                className="px-3 py-2 rounded-md bg-white border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Plus size={18} className="text-amber-500" />
                <span className="text-stone-900 text-sm font-bold">Add Product</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {productFields.map((field, index) => (
                <div key={field.id} className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex-1">
                    <Select
                      onValueChange={(val) => form.setValue(`access.products.${index}.product`, val ?? "")}
                      defaultValue={field.product}
                    >
                      <SelectTrigger className="w-full h-[52px]! px-4 border-none bg-slate-50 shadow-none focus:ring-0 rounded-lg text-slate-900">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent className="w-(--radix-select-trigger-width)">
                        {productsData?.data?.map((p: any) => (
                          <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-40">
                    <Select
                      onValueChange={(val) => form.setValue(`access.products.${index}.fileAccess`, val ?? "")}
                      defaultValue={field.fileAccess}
                    >
                      <SelectTrigger className="w-full h-[52px]! px-4 border-none bg-slate-50 shadow-none focus:ring-0 rounded-lg text-slate-900">
                        <SelectValue placeholder="Access Level" />
                      </SelectTrigger>
                      <SelectContent className="w-(--radix-select-trigger-width)">
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Access Control: Courses */}
          <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-stone-900 text-base font-bold font-inter">
                Course Access
              </label>
              <button
                type="button"
                onClick={() => appendCourse({ value: "" })}
                className="px-3 py-2 rounded-md bg-white border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Plus size={18} className="text-blue-500" />
                <span className="text-stone-900 text-sm font-bold">Add Course</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {courseFields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex-1">
                    <Select
                      onValueChange={(val) => form.setValue(`access.courses.${index}.value`, val ?? "")}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-[52px]! px-4 border-none bg-slate-50 shadow-none focus:ring-0 rounded-lg text-slate-900">
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent className="w-(--radix-select-trigger-width)">
                        {coursesData?.data?.map((c: any) => (
                          <SelectItem key={c._id} value={c._id}>{c.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Access Control: Bundles */}
          <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-stone-900 text-base font-bold font-inter">
                Bundle Access
              </label>
              <button
                type="button"
                onClick={() => appendBundle({ value: "" })}
                className="px-3 py-2 rounded-md bg-white border border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Plus size={18} className="text-purple-500" />
                <span className="text-stone-900 text-sm font-bold">Add Bundle</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {bundleFields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex-1">
                    <Select
                      onValueChange={(val) => form.setValue(`access.bundles.${index}.value`, val ?? "")}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-[52px]! px-4 border-none bg-slate-50 shadow-none focus:ring-0 rounded-lg text-slate-900">
                        <SelectValue placeholder="Select Bundle" />
                      </SelectTrigger>
                      <SelectContent className="w-(--radix-select-trigger-width)">
                        {bundlesData?.data?.map((b: any) => (
                          <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBundle(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 rounded-2xl outline-1 outline-gray-300 text-stone-900 text-base font-medium font-roboto hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] rounded-2xl flex items-center gap-2.5 text-black text-base font-medium font-roboto hover:opacity-90 transition-opacity"
            >
              <SvgPricingCreate className="w-5 h-5 text-black" />
              {isEdit ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

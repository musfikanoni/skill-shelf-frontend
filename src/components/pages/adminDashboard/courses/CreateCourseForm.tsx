"use client";

import React from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../../../../redux/api/userDashboardApi/courseApi";
import { useGetAllCategoriesQuery } from "../../../../redux/api/userDashboardApi/categoryApi";

const courseSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  isPublished: z.boolean(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export const CreateCourseForm = ({
  onSuccess,
  onCancel,
  initialData,
}: {
  onSuccess?: (courseId: string) => void;
  onCancel?: () => void;
  initialData?: any;
}) => {
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const form: UseFormReturn<CourseFormValues> = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category:
        typeof initialData?.category === "object"
          ? initialData.category?._id
          : initialData?.category || "",
      price: initialData?.price?.toString() || "",
      isPublished: initialData?.isPublished ?? true,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        category:
          typeof initialData.category === "object"
            ? initialData.category?._id
            : initialData.category || "",
        price: initialData.price?.toString() || "",
        isPublished: initialData.isPublished ?? true,
      });
      setThumbnailPreview(initialData.thumbnail || null);
    }
  }, [initialData, form]);

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    initialData?.thumbnail || null,
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<CourseFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("isPublished", String(values.isPublished));

      if (thumbnailFile) {
        formData.append("files", thumbnailFile);
      }

      if (initialData) {
        await updateCourse({ id: initialData._id, data: formData }).unwrap();
        toast.success("Course updated successfully!");
        onSuccess?.(initialData._id);
      } else {
        const res = await createCourse(formData).unwrap();
        toast.success("Course created and ready for modules!");
        onSuccess?.(res.data?._id);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save course");
    }
  };

  const isLoading = isCreating || isUpdating;

  const handleSaveDraft = async () => {
    const values = form.getValues();
    if (
      !values.title ||
      !values.description ||
      !values.category ||
      !values.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    await onSubmit({ ...values, isPublished: false });
  };

  return (
    <div className="w-full p-8 bg-white rounded-2xl shadow-lg outline-2 -outline-offset-2 outline-slate-200 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-slate-900 text-2xl font-bold font-inter leading-8">
          {initialData ? "Edit Course" : "Create New Course"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Title */}
            <FormField<CourseFormValues, "title">
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1!">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter mb-2!">
                    Course Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter course title"
                      className="h-12! px-4 py-3 rounded-lg border-2! border-slate-300! bg-white! focus-visible:ring-0!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField<CourseFormValues, "description">
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1!">
                  <FormLabel className="text-slate-700 text-base font-semibold font-inter mb-2!">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter course description"
                      className="min-h-[128px]! px-4 py-3 rounded-lg border-2! border-slate-300! bg-white! focus-visible:ring-0!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <FormField<CourseFormValues, "category">
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1!">
                    <FormLabel className="text-slate-700 text-base font-semibold font-inter mb-2!">
                      Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full! h-12! px-4 py-3 rounded-lg border-2! border-slate-300! bg-white! focus:ring-0!">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        sideOffset={4}
                        className="w-(--radix-select-trigger-width)! min-w-[200px]! bg-white! border-2! border-slate-200! rounded-lg shadow-xl py-2!"
                      >
                        {categories.map((cat: any) => (
                          <SelectItem
                            key={cat._id}
                            value={cat._id}
                            className="py-3! px-6! cursor-pointer"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField<CourseFormValues, "price">
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1!">
                    <FormLabel className="text-slate-700 text-base font-semibold font-inter mb-2!">
                      Price ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 35"
                        className="h-12! px-4 py-3 rounded-lg border-2! border-slate-300! bg-white! focus-visible:ring-0!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField<CourseFormValues, "isPublished">
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1!">
                    <FormLabel className="text-slate-700 text-base font-semibold font-inter mb-2!">
                      Visibility
                    </FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === "true")}
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full! h-12! px-4 py-3 rounded-lg border-2! border-slate-300! bg-white! focus:ring-0!">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        sideOffset={4}
                        className="w-(--radix-select-trigger-width)! min-w-[200px]! bg-white! border-2! border-slate-200! rounded-lg shadow-xl py-2!"
                      >
                        <SelectItem
                          value="true"
                          className="py-3! px-6! cursor-pointer"
                        >
                          Published
                        </SelectItem>
                        <SelectItem
                          value="false"
                          className="py-3! px-6! cursor-pointer"
                        >
                          Draft
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="flex flex-col gap-1!">
              <label className="text-slate-700 text-base font-semibold font-inter mb-2!">
                Course Thumbnail
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative h-64 w-full rounded-lg outline-2! outline-dashed! outline-slate-300! flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden"
              >
                {thumbnailPreview ? (
                  <>
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={removeThumbnail}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors z-10"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400" />
                    <div className="text-slate-600 text-base font-normal font-inter leading-6">
                      Upload thumbnail image
                    </div>
                    <div className="text-slate-500 text-sm font-normal font-inter leading-5">
                      Recommended: 1280x720px
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-12! px-8 rounded-[14px]! border-2! border-slate-300! text-slate-700 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleSaveDraft}
              className="h-12! px-8 rounded-[14px]! border-2! border-[#CAD5E2]! text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12! px-8 rounded-[14px]! text-black font-bold hover:opacity-90 border-none! transition-all shadow-md flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)",
              }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? "Update Course" : "Create & Add Modules"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";
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
// import { SvgCourseEdit, SvgCourseDelete } from "@/lib/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// import { useGetAllCoursesQuery, useDeleteCourseMutation } from "@/redux/api/userDashboardApi/courseApi";
import { Loader2 } from "lucide-react";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "../../../../redux/api/userDashboardApi/courseApi";
import { SvgCourseDelete, SvgCourseEdit } from "@/lib/icons";

export const CoursesTable = ({
  onEdit,
}: {
  onEdit?: (course: any) => void;
}) => {
  const { data: coursesData, isLoading } = useGetAllCoursesQuery();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const courses = coursesData?.data || [];

  const filteredCourses = React.useMemo(() => {
    let result = courses;

    if (debouncedSearchTerm) {
      result = result.filter((course: any) =>
        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      const isPub = statusFilter === "published";
      result = result.filter((course: any) => course.isPublished === isPub);
    }

    return result;
  }, [courses, debouncedSearchTerm, statusFilter]);

  const handleDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete._id).unwrap();
        toast.success("Course deleted successfully");
        setCourseToDelete(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete course");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-white rounded-2xl shadow-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border-2 border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-slate-900 text-xl font-bold font-inter leading-7">
          All Courses
        </h3>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-80 h-11 px-4 py-2 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-300 flex items-center gap-2 bg-white focus-within:outline-slate-500 transition-colors">
            <Search className="w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search Courses..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 text-base font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-40! h-11! px-4 py-2 rounded-xl outline-2! outline-offset-[-2px]! outline-slate-300! border-none! bg-white! focus:ring-0! text-slate-900 text-lg font-medium leading-6">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent
              sideOffset={4}
              className="bg-white! border-2! border-slate-200! rounded-lg shadow-xl"
            >
              <SelectItem value="all" className="text-lg! font-medium!">
                All Status
              </SelectItem>
              <SelectItem value="published" className="text-lg! font-medium!">
                Published
              </SelectItem>
              <SelectItem value="draft" className="text-lg! font-medium!">
                Draft
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-slate-50 border-b border-slate-200 h-12!">
            <TableHead className="w-80 px-8! text-left text-slate-700 text-base font-bold font-inter leading-6">
              Course Title
            </TableHead>
            <TableHead className="px-6! text-left text-slate-700 text-base font-bold font-inter leading-6">
              Category
            </TableHead>
            <TableHead className="px-6! text-left text-slate-700 text-base font-bold font-inter leading-6">
              Price
            </TableHead>
            <TableHead className="px-6! text-left text-slate-700 text-base font-bold font-inter leading-6">
              Rating
            </TableHead>
            <TableHead className="px-6! text-left text-slate-700 text-base font-bold font-inter leading-6">
              Status
            </TableHead>
            <TableHead className="px-8! text-left text-slate-700 text-base font-bold font-inter leading-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course: any) => (
              <TableRow
                key={course._id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors h-16!"
              >
                <TableCell className="px-8! text-left">
                  <span className="text-slate-900 text-base font-bold font-inter leading-6">
                    {course.title}
                  </span>
                </TableCell>
                <TableCell className="px-6! text-left">
                  <span className="text-slate-600 text-base font-medium">
                    {course.category?.name || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="px-6! text-left">
                  <span className="text-blue-600 text-base font-bold">
                    ${course.price}
                  </span>
                </TableCell>
                <TableCell className="px-6! text-left">
                  <div className="flex items-center gap-1 text-yellow-600 font-bold">
                    <span>⭐</span>
                    <span>{course.averageRating || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6! text-left">
                  <div className="flex justify-start">
                    <span
                      className={`px-3 py-1 rounded-[10px] text-sm font-bold font-inter leading-5 capitalize ${
                        course.isPublished
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {course.isPublished ? "published" : "draft"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8! text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit?.(course)}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                    >
                      <SvgCourseEdit />
                    </button>
                    <button
                      onClick={() => setCourseToDelete(course)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <SvgCourseDelete />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-40 text-center text-slate-500 font-inter text-base"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-lg font-semibold text-slate-700">
                    No courses found
                  </span>
                  <p>
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <DialogContent className="sm:max-w-[480px] bg-white rounded-[24px]! p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-6 pb-5">
            <div className="flex justify-between items-center mb-3">
              <DialogTitle className="text-[22px] font-bold text-[#0F172A] font-inter">
                Delete Course
              </DialogTitle>
            </div>
            <DialogDescription className="text-[#475569] text-base font-normal font-inter leading-normal">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                "{courseToDelete?.title}"
              </span>
              ? This action cannot be undone and all course data will be
              permanently removed.
            </DialogDescription>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          <div className="p-6 pt-5 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setCourseToDelete(null)}
              disabled={isDeleting}
              className="rounded-xl! border-2! border-slate-200! text-slate-700! font-bold text-sm px-6 h-11 hover:bg-slate-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl! bg-[#E11D48]! hover:bg-[#BE123C]! text-white! font-bold text-sm px-6 h-11 border-none transition-all shadow-md flex items-center gap-2"
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

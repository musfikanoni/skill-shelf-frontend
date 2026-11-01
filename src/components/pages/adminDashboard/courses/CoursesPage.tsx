"use client";

import { useState } from "react";
import { CreateCourseForm } from "./CreateCourseForm";
// import { CourseModuleManager } from "./CourseModuleManager";

import { useGetAllCoursesQuery } from "@/redux/api/userDashboardApi/courseApi";
import { CoursesTable } from "./CoursesTable";
import CourseClientManager from "./CourseClientManager";
import { CourseStatCard } from "./CourseStatCard";
import { CourseModuleManager } from "./CourseModuleManager";

export default function CoursesPage() {
  const { data: coursesData } = useGetAllCoursesQuery();
  const [showForm, setShowForm] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  const courses = coursesData?.data || [];
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c: any) => c.isPublished).length;

  const currentCourse = courses.find((c: any) => c._id === activeCourseId);

  const handleCreateCourse = () => {
    if (showForm || showModules || editingCourse) {
      setShowForm(false);
      setShowModules(false);
      setEditingCourse(null);
      setActiveCourseId(null);
    } else {
      setShowForm(true);
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setActiveCourseId(course._id);
    setShowForm(true);
    setShowModules(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSuccess = (courseId: string) => {
    setActiveCourseId(courseId);
    setShowModules(true);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowModules(false);
    setEditingCourse(null);
    setActiveCourseId(null);
  };

  return (
    <CourseClientManager
      title="Courses"
      description="Manage online courses and curriculum"
      onCreateClick={handleCreateCourse}
      buttonLabel="Create Course"
    >
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <CourseStatCard label="Total Courses" value={totalCourses.toString()} variant="slate" />
          <CourseStatCard label="Published" value={publishedCourses.toString()} variant="emerald" />
          <CourseStatCard label="Total Students" value="2,847" variant="purple" />
          <CourseStatCard label="Avg Rating" value="4.7" variant="yellow" />
        </div>

        {/* Create/Edit Course Form Section */}
        {showForm && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <CreateCourseForm 
              onSuccess={handleFormSuccess} 
              onCancel={handleCancel}
              initialData={editingCourse}
            />
          </div>
        )}

        {showModules && (
          <div className="flex flex-col gap-6">
            <CourseModuleManager
              onSave={() => setShowModules(false)} 
              onClose={() => setShowModules(false)} 
              courseId={activeCourseId || ""}
            />
          </div>
        )}

        <div className="flex flex-col gap-6">
          <CoursesTable onEdit={handleEditCourse} />
        </div>
      </div>
    </CourseClientManager>
  );
}

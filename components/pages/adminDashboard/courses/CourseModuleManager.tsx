"use client";

import React from "react";
import { Upload, X, ChevronDown, Play, Trash2, Edit2, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  useCreateMilestoneMutation, 
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation, 
  useCreateVideoMutation, 
  usePublishVideoMutation,
  useDeleteVideoMutation,
  useGetMilestonesByCourseQuery,
  useGetVideosByMilestoneQuery
} from "@/redux/api/userDashboardApi/courseApi";

const VideoList = ({ milestoneId, onDeleteVideo }: { milestoneId: string, onDeleteVideo: (id: string) => void }) => {
  const { data: videosData, isLoading } = useGetVideosByMilestoneQuery(milestoneId);
  const [publishVideo, { isLoading: isPublishing }] = usePublishVideoMutation();
  
  const handlePublish = async (videoId: string) => {
    try {
      await publishVideo(videoId).unwrap();
      toast.success("Video published successfully!");
    } catch (error: any) {
      toast.error("Failed to publish video");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  const rawData = videosData?.data;
  const videos = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);

  if (videos.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 font-inter bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        No videos added to this milestone yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {videos.map((video: any) => (
        <div key={video._id} className="w-full h-20 px-4 py-4 bg-slate-50 rounded-[10px] border-2 border-slate-200 flex items-center justify-between hover:bg-slate-100/50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[10px] flex items-center justify-center shadow-sm">
               <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-slate-900 text-base font-semibold font-inter leading-6">{video.title}</h4>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 text-sm font-normal font-inter flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {video.duration || "0:00"}
                </span>
                {video.isPublished ? (
                  <span className="text-emerald-600 text-sm font-semibold font-inter flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published
                  </span>
                ) : (
                  <span className="text-amber-600 text-sm font-semibold font-inter">Draft</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!video.isPublished && (
              <button 
                disabled={isPublishing}
                onClick={() => handlePublish(video._id)}
                className="px-3 h-8 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-1"
              >
                {isPublishing && <Loader2 className="w-3 h-3 animate-spin" />}
                Publish
              </button>
            )}
            <button 
              onClick={() => onDeleteVideo(video._id)}
              className="p-2 bg-red-100 rounded-[10px] text-red-700 hover:bg-red-200 transition-all"
            >
               <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const CourseModuleManager = ({ 
  onSave, 
  onClose,
  courseId
}: { 
  onSave?: () => void; 
  onClose?: () => void;
  courseId: string;
}) => {
  // Live API Data
  const { data: milestonesData, isLoading: isLoadingMilestones } = useGetMilestonesByCourseQuery(courseId, {
    skip: !courseId
  });
  
  // Local UI State
  const [expandedMilestones, setExpandedMilestones] = React.useState<string[]>([]);
  const [addingLessonId, setAddingLessonId] = React.useState<string | null>(null);
  const [editingMilestoneId, setEditingMilestoneId] = React.useState<string | null>(null);
  const [editMilestoneTitle, setEditMilestoneTitle] = React.useState("");

  // API Mutations
  const [createMilestone, { isLoading: isCreatingMilestone }] = useCreateMilestoneMutation();
  const [updateMilestoneApi, { isLoading: isUpdatingMilestone }] = useUpdateMilestoneMutation();
  const [deleteMilestoneApi] = useDeleteMilestoneMutation();
  const [createVideo, { isLoading: isCreatingVideo }] = useCreateVideoMutation();
  const [deleteVideoApi] = useDeleteVideoMutation();

  // Local form state for lesson
  const [newLessonTitle, setNewLessonTitle] = React.useState("");
  const [lessonDuration, setLessonDuration] = React.useState("");
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [newModuleTitle, setNewModuleTitle] = React.useState("");

  const milestones = milestonesData?.data || [];

  const toggleModule = (milestoneId: string) => {
    setExpandedMilestones(prev => 
      prev.includes(milestoneId) 
        ? prev.filter(id => id !== milestoneId) 
        : [...prev, milestoneId]
    );
  };

  const handleAddModule = async () => {
    if (!newModuleTitle) {
      toast.error("Please enter a module title");
      return;
    }
    try {
      await createMilestone({ 
        title: newModuleTitle, 
        course: courseId
      }).unwrap();
      
      setNewModuleTitle("");
      toast.success("New milestone created successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create milestone");
    }
  };

  const handleUpdateMilestone = async (milestoneId: string) => {
    if (!editMilestoneTitle) return;
    try {
      await updateMilestoneApi({ 
        id: milestoneId, 
        data: { title: editMilestoneTitle } 
      }).unwrap();
      setEditingMilestoneId(null);
      toast.success("Milestone updated");
    } catch (error: any) {
      toast.error("Failed to update milestone");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await deleteMilestoneApi(moduleId).unwrap();
      toast.success("Milestone deleted");
    } catch (error: any) {
      toast.error("Failed to delete milestone");
    }
  };

  const handleAddLesson = async (milestoneId: string) => {
    if (!newLessonTitle || !videoFile) {
      toast.error("Title and Video are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newLessonTitle);
      formData.append("course", courseId);
      formData.append("milestone", milestoneId);
      formData.append("files", videoFile);

      await createVideo(formData).unwrap();
      
      // Reset form
      setNewLessonTitle("");
      setLessonDuration("");
      setVideoFile(null);
      setAddingLessonId(null);
      
      toast.success("Video added successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add video");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideoApi(videoId).unwrap();
      toast.success("Video removed");
    } catch (error: any) {
      toast.error("Failed to remove video");
    }
  };

  if (isLoadingMilestones) {
    return (
      <div className="w-full p-20 bg-white rounded-2xl shadow-lg border-2 border-purple-300 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-white rounded-2xl shadow-lg border-2 border-purple-300 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center h-10">
        <h2 className="text-slate-900 text-2xl font-bold font-inter leading-8">Add Course Modules & Lessons</h2>
        <div className="p-2 rounded-[10px] cursor-pointer hover:bg-slate-100 transition-colors" onClick={onClose}>
           <X className="w-6 h-6 text-slate-600" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Module List */}
        {milestones.map((module: any) => {
          const isExpanded = expandedMilestones.includes(module._id);
          const isAddingLesson = addingLessonId === module._id;
          const isEditing = editingMilestoneId === module._id;
          
          return (
            <div key={module._id} className="w-full bg-white rounded-2xl border-2 border-purple-200 overflow-hidden shadow-sm">
      
              <div className="w-full h-20 px-6 bg-purple-50 flex items-center justify-between border-b border-purple-200">
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    onClick={() => toggleModule(module._id)}
                    className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-transform duration-300 ${isExpanded ? "" : "-rotate-90"}`}
                  >
                    <span className="text-neutral-950 text-base font-medium">▼</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                     <Play className="w-5 h-5 text-purple-600" />
                     {isEditing ? (
                       <div className="flex items-center gap-2 flex-1">
                         <Input 
                           value={editMilestoneTitle}
                           onChange={(e) => setEditMilestoneTitle(e.target.value)}
                           className="h-9 px-3 py-1 text-base font-bold bg-white border-2 border-purple-300"
                           autoFocus
                         />
                         <button 
                           onClick={() => handleUpdateMilestone(module._id)}
                           className="p-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                         >
                           <CheckCircle2 className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => setEditingMilestoneId(null)}
                           className="p-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                         >
                           <X className="w-5 h-5" />
                         </button>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2">
                         <h3 className="text-slate-900 text-lg font-bold font-inter truncate max-w-[400px]">
                           {module.title}
                         </h3>
                         <button 
                           onClick={() => {
                             setEditingMilestoneId(module._id);
                             setEditMilestoneTitle(module.title);
                           }}
                           className="p-1.5 text-slate-500 hover:text-purple-600 transition-colors"
                         >
                            <Edit2 className="w-4 h-4" />
                         </button>
                       </div>
                     )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setAddingLessonId(isAddingLesson ? null : module._id)}
                    className="px-4 h-9 rounded-[10px] text-white text-sm font-semibold font-inter hover:opacity-90 transition-all shadow-md"
                    style={{
                      background: "linear-gradient(180deg, #6C3FC5 50%, #341E5F 145%)"
                    }}
                  >
                    {isAddingLesson ? "Cancel" : "+ Add Lesson"}
                  </button>
                  <button 
                    onClick={() => handleDeleteModule(module._id)}
                    className="px-4 h-9 bg-red-100 rounded-[10px] text-red-700 text-sm font-semibold font-inter hover:bg-red-200 transition-all"
                  >
                    Delete Module
                  </button>
                </div>
              </div>

              {/* Module Content */}
              {(isExpanded || isAddingLesson) && (
                <div className="p-6 flex flex-col gap-4">
     
                  {isAddingLesson && (
                    <div className="w-full p-6 bg-blue-50 rounded-2xl border-2 border-blue-200 flex flex-col gap-6 animate-in zoom-in-95 duration-300">
                      <h4 className="text-slate-900 text-base font-bold font-inter">Add New Lesson</h4>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-slate-700 text-sm font-semibold font-inter">Lesson Title</label>
                          <Input 
                            value={newLessonTitle}
                            onChange={(e) => setNewLessonTitle(e.target.value)}
                            placeholder="e.g., Introduction to Marketing"
                            className="h-11 px-4 py-2 rounded-[10px] border-2 border-slate-300 bg-white focus-visible:ring-0"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-slate-700 text-sm font-semibold font-inter">Upload Video</label>
                          <input 
                            type="file" 
                            id={`video-upload-${module._id}`}
                            className="hidden" 
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          />
                          <label 
                            htmlFor={`video-upload-${module._id}`}
                            className="h-28 rounded-[10px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/50 transition-colors overflow-hidden relative"
                          >
                            {videoFile ? (
                              <div className="flex flex-col items-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                <p className="text-slate-700 text-sm font-medium">{videoFile.name}</p>
                                <p className="text-slate-500 text-xs">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-slate-400" />
                                <p className="text-slate-600 text-sm font-normal font-inter">Click to upload video or drag and drop</p>
                                <p className="text-slate-500 text-xs font-normal font-inter">MP4, MOV, AVI up to 500MB</p>
                              </>
                            )}
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            disabled={isCreatingVideo}
                            onClick={() => setAddingLessonId(null)}
                            className="flex-1 h-11 rounded-[10px] border-2 border-slate-300 text-slate-700 font-semibold font-inter hover:bg-white transition-all disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button 
                            disabled={isCreatingVideo}
                            onClick={() => handleAddLesson(module._id)}
                            className="flex-1 h-11 rounded-[10px] text-white font-semibold font-inter hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{
                              background: "linear-gradient(180deg, #6C3FC5 50%, #341E5F 145%)"
                            }}
                          >
                            {isCreatingVideo && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isCreatingVideo ? "Uploading..." : "Add Video"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Videos List */}
                  {isExpanded && (
                    <VideoList 
                      milestoneId={module._id} 
                      onDeleteVideo={handleDeleteVideo} 
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Create New Module Section */}
        <div className="w-full p-6 bg-purple-50 rounded-2xl border-2 border-purple-300 flex flex-col gap-4 shadow-sm">
          <h4 className="text-slate-900 text-lg font-bold font-inter leading-7">Create New Module</h4>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 text-base font-semibold font-inter">Module Title</label>
              <Input 
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="e.g., Advanced Marketing Strategies"
                className="h-12 px-4 py-3 rounded-[10px] border-2 border-slate-300 bg-white focus-visible:ring-0"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setNewModuleTitle("")}
                className="flex-1 h-12 rounded-[10px] border-2 border-slate-300 bg-white text-slate-700 font-bold font-inter hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isCreatingMilestone}
                onClick={handleAddModule}
                className="flex-1 h-12 rounded-[10px] text-black font-bold font-inter hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)"
                }}
              >
                {isCreatingMilestone && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCreatingMilestone ? "Creating..." : "Create Module"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-[10px] border-2 border-slate-300 text-slate-700 font-bold font-inter hover:bg-slate-50 transition-all"
          >
            Close
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 h-12 rounded-[10px] text-black font-bold font-inter border-none shadow-md hover:opacity-90 transition-all"
            style={{
              background: "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)"
            }}
          >
            Save Course
          </Button>
        </div>
      </div>
    </div>
  );
};

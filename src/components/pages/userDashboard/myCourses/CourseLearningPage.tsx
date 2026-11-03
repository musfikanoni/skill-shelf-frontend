"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  PlayCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Search,
  Check,
  Video,
  Award,
  Layers,
  HelpCircle,
  ExternalLink,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetMyEnrollmentsQuery,
  useGetMilestonesByCourseQuery,
  useGetVideosByMilestoneQuery,
} from "@/redux/api/userDashboardApi/courseApi";
import { useGetCourseByIdQuery } from "@/redux/api/landingPageApi/LandingPageApi";
import Loading from "@/components/Others/Loading";

interface VideoItem {
  _id: string;
  title: string;
  duration?: string | number;
  isPublished?: boolean;
  videoUrl?: string;
  url?: string;
  video?: string;
  file?: string;
  files?: any;
  milestoneTitle?: string;
  milestoneId?: string;
  [key: string]: any;
}

const BACKEND_BASE = "https://skill-shelf-backend.vercel.app";

const normalizeUrl = (raw: string): string => {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    return `${BACKEND_BASE}${trimmed}`;
  }
  if (trimmed.startsWith("uploads/") || trimmed.startsWith("videos/")) {
    return `${BACKEND_BASE}/${trimmed}`;
  }
  return trimmed;
};

// Deep, comprehensive video URL extractor that works with all backend response shapes
const extractVideoUrl = (video: any): string => {
  if (!video) return "";
  if (typeof video === "string") return normalizeUrl(video);

  // 1. Direct candidate fields
  const directFields = [
    "videoUrl",
    "video_url",
    "url",
    "video",
    "file",
    "fileUrl",
    "filesUrl",
    "secure_url",
    "playbackUrl",
    "mediaUrl",
    "media",
    "link",
    "videoLink",
    "path",
    "videoPath",
    "src",
    "source",
    "uri",
  ];

  for (const field of directFields) {
    const val = video[field];
    if (typeof val === "string" && val.trim()) {
      return normalizeUrl(val);
    }
    if (val && typeof val === "object") {
      if (typeof val.url === "string") return normalizeUrl(val.url);
      if (typeof val.secure_url === "string") return normalizeUrl(val.secure_url);
      if (typeof val.path === "string") return normalizeUrl(val.path);
    }
  }

  // 2. files property (can be string, array, or object)
  if (video.files) {
    if (typeof video.files === "string" && video.files.trim()) {
      return normalizeUrl(video.files);
    }
    if (Array.isArray(video.files) && video.files.length > 0) {
      for (const item of video.files) {
        if (typeof item === "string" && item.trim()) return normalizeUrl(item);
        if (item && typeof item === "object") {
          if (item.url) return normalizeUrl(item.url);
          if (item.secure_url) return normalizeUrl(item.secure_url);
          if (item.path) return normalizeUrl(item.path);
        }
      }
    }
    if (typeof video.files === "object") {
      if (video.files.url) return normalizeUrl(video.files.url);
      if (video.files.secure_url) return normalizeUrl(video.files.secure_url);
      if (video.files.path) return normalizeUrl(video.files.path);
    }
  }

  // 3. Fallback: inspect any string property for video-like URLs or paths
  for (const key of Object.keys(video)) {
    if (["_id", "course", "milestone", "title", "createdAt", "updatedAt", "__v", "category"].includes(key)) {
      continue;
    }
    const val = video[key];
    if (typeof val === "string") {
      const lower = val.toLowerCase();
      if (
        lower.includes(".mp4") ||
        lower.includes(".webm") ||
        lower.includes(".mkv") ||
        lower.includes(".mov") ||
        lower.includes("cloudinary.com") ||
        lower.includes("youtube.com") ||
        lower.includes("youtu.be") ||
        lower.includes("vimeo.com") ||
        lower.startsWith("http://") ||
        lower.startsWith("https://")
      ) {
        return normalizeUrl(val);
      }
    }
  }

  return "";
};

const getVideoType = (url: string): "youtube" | "vimeo" | "direct" | "none" => {
  if (!url) return "none";
  if (/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/.test(url)) {
    return "youtube";
  }
  if (/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/.test(url)) {
    return "vimeo";
  }
  return "direct";
};

const getEmbedUrl = (url: string, type: "youtube" | "vimeo"): string => {
  if (type === "youtube") {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  }
  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    return match && match[1] ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : url;
  }
  return url;
};

// Subcomponent for each milestone in the curriculum list
const MilestoneItem = ({
  milestone,
  index,
  isExpanded,
  onToggle,
  activeVideoId,
  completedVideoIds,
  onSelectVideo,
  onVideosLoaded,
  searchTerm,
}: {
  milestone: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  activeVideoId: string | null;
  completedVideoIds: string[];
  onSelectVideo: (video: VideoItem) => void;
  onVideosLoaded: (milestoneId: string, videos: VideoItem[]) => void;
  searchTerm: string;
}) => {
  const { data: videosData, isLoading } = useGetVideosByMilestoneQuery(milestone._id);
  const rawData = videosData?.data;
  const videos: any[] = useMemo(() => {
    return Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
  }, [rawData]);

  useEffect(() => {
    if (videos && videos.length > 0) {
      const formatted: VideoItem[] = videos.map((v) => ({
        ...v,
        milestoneTitle: milestone.title,
        milestoneId: milestone._id,
      }));
      onVideosLoaded(milestone._id, formatted);
    }
  }, [videos, milestone._id, milestone.title, onVideosLoaded]);

  const filteredVideos = useMemo(() => {
    if (!searchTerm.trim()) return videos;
    const term = searchTerm.toLowerCase();
    return videos.filter((v: any) => v.title?.toLowerCase().includes(term));
  }, [videos, searchTerm]);

  const completedCount = useMemo(() => {
    return videos.filter((v: any) => completedVideoIds.includes(v._id)).length;
  }, [videos, completedVideoIds]);

  return (
    <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left bg-slate-50/70 hover:bg-slate-100/70 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <span className="w-6 h-6 rounded-md bg-[#6C3FC5]/10 text-[#6C3FC5] text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate leading-snug">
              {milestone.title}
            </h4>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              {videos.length} {videos.length === 1 ? "lesson" : "lessons"}
              {videos.length > 0 && ` • ${completedCount}/${videos.length} done`}
            </p>
          </div>
        </div>
        <div className="text-slate-400 shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <div className="py-4 text-center text-xs text-slate-400">
              Loading lessons...
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="py-4 px-4 text-center text-xs text-slate-400">
              {searchTerm ? "No matching lessons in this module" : "No lessons in this module yet."}
            </div>
          ) : (
            filteredVideos.map((video: any, vIndex: number) => {
              const isActive = activeVideoId === video._id;
              const isDone = completedVideoIds.includes(video._id);

              return (
                <button
                  type="button"
                  key={video._id}
                  onClick={() =>
                    onSelectVideo({
                      ...video,
                      milestoneTitle: milestone.title,
                      milestoneId: milestone._id,
                    })
                  }
                  className={`w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group ${
                    isActive
                      ? "bg-[#F5F3FF] text-[#6C3FC5] font-semibold border-l-4 border-[#6C3FC5]"
                      : "hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-transform group-hover:scale-110 shadow-sm ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isActive
                          ? "bg-[#6C3FC5] text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-[#6C3FC5] group-hover:text-white"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3 w-3 fill-current ml-0.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs md:text-sm truncate ${
                          isActive
                            ? "font-bold text-[#6C3FC5]"
                            : isDone
                            ? "text-slate-500"
                            : "text-slate-700 group-hover:text-[#6C3FC5]"
                        }`}
                      >
                        {vIndex + 1}. {video.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        {video.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </span>
                        )}
                        {video.isPublished === false && (
                          <span className="text-amber-500 font-semibold">(Draft)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <Badge className="bg-[#6C3FC5] text-white text-[10px] px-2 py-0.5 rounded-full shrink-0 border-none">
                      Playing
                    </Badge>
                  ) : (
                    <span className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-[#6C3FC5] shrink-0">
                      Play
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default function CourseLearningPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "";

  // 1. Fetch user's enrollments to verify access and get enrollment data
  const {
    data: enrollmentsData,
    isLoading: isLoadingEnrollments,
  } = useGetMyEnrollmentsQuery();

  const enrolledCourse = useMemo(() => {
    const list = enrollmentsData?.data || [];
    return list.find((e: any) => e.course?._id === rawId || e._id === rawId);
  }, [enrollmentsData, rawId]);

  const courseId = enrolledCourse?.course?._id || rawId;

  // 2. Fetch full course details
  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseByIdQuery(
    courseId,
    { skip: !courseId }
  );

  const course = courseData?.data?.data || courseData?.data || enrolledCourse?.course;

  // 3. Fetch course milestones
  const {
    data: milestonesData,
    isLoading: isLoadingMilestones,
  } = useGetMilestonesByCourseQuery(courseId, { skip: !courseId });

  const milestones: any[] = milestonesData?.data || [];

  // State management
  const [activeTab, setActiveTab] = useState<"overview" | "resources">("overview");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expandedMilestones, setExpandedMilestones] = useState<string[]>([]);
  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allVideosMap, setAllVideosMap] = useState<Record<string, VideoItem[]>>({});
  const [videoLoadError, setVideoLoadError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Flattened video list for previous/next lesson navigation
  const flatVideos = useMemo(() => {
    const list: VideoItem[] = [];
    milestones.forEach((m: any) => {
      const vids = allVideosMap[m._id] || [];
      list.push(...vids);
    });
    return list;
  }, [milestones, allVideosMap]);

  // Load completed videos from localStorage
  useEffect(() => {
    if (!courseId) return;
    try {
      const stored = localStorage.getItem(`course_progress_${courseId}`);
      if (stored) {
        setCompletedVideoIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
  }, [courseId]);

  // Save progress to localStorage
  const toggleCompleteVideo = (videoId: string) => {
    if (!videoId) return;
    setCompletedVideoIds((prev) => {
      const next = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      if (courseId) {
        try {
          localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save progress", e);
        }
      }
      return next;
    });
  };

  // Expand the first milestone by default once milestones load
  useEffect(() => {
    if (milestones.length > 0 && expandedMilestones.length === 0) {
      setExpandedMilestones([milestones[0]._id]);
    }
  }, [milestones, expandedMilestones.length]);

  // Callback when milestone videos load
  const handleVideosLoaded = useCallback(
    (milestoneId: string, videos: VideoItem[]) => {
      setAllVideosMap((prev) => {
        if (JSON.stringify(prev[milestoneId]) === JSON.stringify(videos)) {
          return prev;
        }
        return { ...prev, [milestoneId]: videos };
      });
    },
    []
  );

  // Auto-select first video once available
  useEffect(() => {
    if (!activeVideo && flatVideos.length > 0) {
      setActiveVideo(flatVideos[0]);
      setIsPlaying(true);
    }
  }, [activeVideo, flatVideos]);

  // Reset error when active video changes
  useEffect(() => {
    setVideoLoadError(false);
  }, [activeVideo]);

  // Play video with browser policy tolerance
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was blocked by browser policy, waiting for user click:", err);
      });
    }
  }, [activeVideo, isPlaying]);

  // Toggle milestone expand/collapse
  const toggleMilestone = (mId: string) => {
    setExpandedMilestones((prev) =>
      prev.includes(mId) ? prev.filter((id) => id !== mId) : [...prev, mId]
    );
  };

  // Selecting a video from playlist
  const handleSelectVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setIsPlaying(true);
    setVideoLoadError(false);
    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  // Big Play button click handler
  const handlePlayButtonClick = () => {
    if (!activeVideo && flatVideos.length > 0) {
      setActiveVideo(flatVideos[0]);
    }
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Play error:", err);
      });
    }
  };

  // Previous and Next video navigation
  const currentVideoIndex = useMemo(() => {
    if (!activeVideo) return -1;
    return flatVideos.findIndex((v) => v._id === activeVideo._id);
  }, [activeVideo, flatVideos]);

  const hasPrevious = currentVideoIndex > 0;
  const hasNext = currentVideoIndex >= 0 && currentVideoIndex < flatVideos.length - 1;

  const handlePreviousVideo = () => {
    if (hasPrevious) {
      const prev = flatVideos[currentVideoIndex - 1];
      handleSelectVideo(prev);
      if (prev.milestoneId && !expandedMilestones.includes(prev.milestoneId)) {
        setExpandedMilestones((m) => [...m, prev.milestoneId!]);
      }
    }
  };

  const handleNextVideo = () => {
    if (hasNext) {
      const next = flatVideos[currentVideoIndex + 1];
      handleSelectVideo(next);
      if (next.milestoneId && !expandedMilestones.includes(next.milestoneId)) {
        setExpandedMilestones((m) => [...m, next.milestoneId!]);
      }
    }
  };

  const videoUrl = activeVideo ? extractVideoUrl(activeVideo) : "";
  const videoType = getVideoType(videoUrl);

  const totalLessonsCount = flatVideos.length || enrolledCourse?.totalVideos || 0;
  const progressPercent = totalLessonsCount > 0
    ? Math.round((completedVideoIds.length / totalLessonsCount) * 100)
    : enrolledCourse?.progress || 0;

  if (isLoadingEnrollments || isLoadingCourse || isLoadingMilestones) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Course Not Found</h2>
        <p className="text-slate-500 max-w-md text-sm mb-6">
          We could not load this course or you might not be enrolled yet.
        </p>
        <Link href="/user-dashboard/my-courses">
          <Button className="bg-[#6C3FC5] hover:bg-[#5b32aa] text-white font-bold rounded-xl px-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Courses
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Navigation & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/user-dashboard/my-courses">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 text-slate-600 hover:text-black hover:bg-slate-50 gap-2 font-bold cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to</span> My Courses
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#F5F3FF] text-[#6C3FC5] hover:bg-[#F5F3FF] border-none font-extrabold text-[10px] px-2.5 py-0.5 rounded-md">
                Course Classroom
              </Badge>
              {course.category?.name && (
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  • {course.category.name}
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1E293B] truncate mt-1">
              {course.title?.replace(/(^"|"$)/g, "") || "Course Learning"}
            </h1>
          </div>
        </div>

        {/* Course Progress Summary */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 shrink-0">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Course Progress
            </p>
            <p className="text-sm font-extrabold text-[#6C3FC5]">
              {progressPercent}% Complete
            </p>
          </div>
          <div className="w-24">
            <Progress
              value={progressPercent}
              className="h-2 bg-slate-200 [&>div]:bg-[#6C3FC5]"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Video Player on Left, Playlist on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Meta (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Card */}
          <div
            ref={playerContainerRef}
            className="bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-800 aspect-video relative flex items-center justify-center group"
          >
            {videoType === "youtube" ? (
              <iframe
                key={videoUrl}
                src={getEmbedUrl(videoUrl, "youtube")}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo?.title || "Video Lesson"}
              />
            ) : videoType === "vimeo" ? (
              <iframe
                key={videoUrl}
                src={getEmbedUrl(videoUrl, "vimeo")}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={activeVideo?.title || "Video Lesson"}
              />
            ) : videoType === "direct" && !videoLoadError ? (
              <video
                ref={videoRef}
                key={videoUrl}
                src={videoUrl}
                controls
                playsInline
                autoPlay
                preload="metadata"
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onError={(e) => {
                  console.error("Video load error for url:", videoUrl, e);
                  setVideoLoadError(true);
                }}
                onEnded={() => {
                  if (activeVideo?._id) {
                    toggleCompleteVideo(activeVideo._id);
                  }
                  if (hasNext) {
                    handleNextVideo();
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              // Player Fallback / Placeholder with clickable Play Button
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
                {/* Big Interactive Play Button */}
                <button
                  type="button"
                  onClick={handlePlayButtonClick}
                  className="w-20 h-20 rounded-full bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:scale-110 active:scale-95 text-black flex items-center justify-center shadow-2xl shadow-yellow-500/40 transition-all cursor-pointer mb-4 group"
                  title="Play Lesson"
                >
                  <Play className="h-9 w-9 fill-black ml-1 transition-transform group-hover:scale-110" />
                </button>

                <h3 className="text-lg md:text-xl font-extrabold max-w-md px-4 leading-snug">
                  {activeVideo ? activeVideo.title : "Ready to Start Learning"}
                </h3>

                <p className="text-xs text-slate-300 max-w-sm mt-2">
                  {videoLoadError ? (
                    <span className="text-amber-400">
                      Browser playback blocked. You can watch using the external link below.
                    </span>
                  ) : activeVideo ? (
                    "Click the Play button above or choose a lesson from the curriculum."
                  ) : (
                    "Select a lesson from the right sidebar to begin watching."
                  )}
                </p>

                {videoUrl && (
                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Video in New Tab
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Lesson Controls & Action Bar */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                {activeVideo?.milestoneTitle && (
                  <p className="text-xs font-bold text-[#6C3FC5] uppercase tracking-wider">
                    {activeVideo.milestoneTitle}
                  </p>
                )}
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1E293B]">
                  {activeVideo?.title || "Select a Lesson"}
                </h2>
                <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs font-semibold text-slate-400">
                  {activeVideo?.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Duration: {activeVideo.duration}
                    </span>
                  )}
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="text-[#6C3FC5] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Theater Mode
                    </button>
                  )}
                </div>
              </div>

              {activeVideo && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => toggleCompleteVideo(activeVideo._id)}
                    variant="outline"
                    className={`rounded-xl font-bold text-xs h-10 px-4 gap-2 transition-all cursor-pointer ${
                      completedVideoIds.includes(activeVideo._id)
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        completedVideoIds.includes(activeVideo._id)
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    />
                    {completedVideoIds.includes(activeVideo._id)
                      ? "Completed"
                      : "Mark as Completed"}
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation buttons: Previous and Next Lesson */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button
                onClick={handlePreviousVideo}
                disabled={!hasPrevious}
                variant="outline"
                className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs h-10 px-4 gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>

              <div className="text-xs font-semibold text-slate-400 hidden sm:block">
                {currentVideoIndex >= 0
                  ? `Lesson ${currentVideoIndex + 1} of ${flatVideos.length}`
                  : `${flatVideos.length} Total Lessons`}
              </div>

              <Button
                onClick={handleNextVideo}
                disabled={!hasNext}
                className="bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold rounded-xl text-xs h-10 px-4 gap-1.5 shadow-sm shadow-yellow-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs: Overview, Notes & Resources */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`pb-2 text-sm font-bold transition-colors cursor-pointer relative ${
                  activeTab === "overview"
                    ? "text-[#6C3FC5]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                About this Course
                {activeTab === "overview" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C3FC5] rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("resources")}
                className={`pb-2 text-sm font-bold transition-colors cursor-pointer relative ${
                  activeTab === "resources"
                    ? "text-[#6C3FC5]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Resources & Support
                {activeTab === "resources" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C3FC5] rounded-full" />
                )}
              </button>
            </div>

            {activeTab === "overview" && (
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  {course.description?.replace(/(^"|"$)/g, "") ||
                    "Master all the core and advanced concepts covered in this comprehensive training program."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Modules</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-1">
                      {milestones.length} Modules
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Lessons</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-1">
                      {flatVideos.length} Lessons
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Access</p>
                    <p className="text-lg font-extrabold text-slate-800 mt-1">
                      Lifetime Access
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F5F3FF] rounded-xl border border-purple-100 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#6C3FC5] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#6C3FC5]">Learning Tips</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Take notes as you watch the lessons, build along with each exercise, and mark each lesson completed when you finish.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Need Help or Questions?</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Reach out to our student support team for assistance with course materials or questions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Curriculum Playlist */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#6C3FC5]" />
                <h3 className="font-extrabold text-[#1E293B] text-base">
                  Course Content
                </h3>
              </div>
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-bold text-xs px-2.5 py-0.5 rounded-lg">
                {completedVideoIds.length}/{totalLessonsCount} Completed
              </Badge>
            </div>

            {/* Lesson Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>

            {/* Milestones Accordion */}
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {milestones.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No modules or lessons have been uploaded for this course yet.
                </div>
              ) : (
                milestones.map((m: any, idx: number) => (
                  <MilestoneItem
                    key={m._id}
                    milestone={m}
                    index={idx}
                    isExpanded={expandedMilestones.includes(m._id)}
                    onToggle={() => toggleMilestone(m._id)}
                    activeVideoId={activeVideo?._id || null}
                    completedVideoIds={completedVideoIds}
                    onSelectVideo={handleSelectVideo}
                    onVideosLoaded={handleVideosLoaded}
                    searchTerm={searchTerm}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theater / Fullscreen Video Dialog Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl w-[95vw] p-4 bg-black text-white border-slate-800 rounded-2xl">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-white text-base font-bold flex items-center justify-between">
                <span>{activeVideo?.title || "Lesson Video"}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {videoType === "youtube" ? (
                <iframe
                  src={getEmbedUrl(videoUrl, "youtube")}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoType === "vimeo" ? (
                <iframe
                  src={getEmbedUrl(videoUrl, "vimeo")}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

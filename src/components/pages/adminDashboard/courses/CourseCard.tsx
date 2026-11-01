import React from "react";
import { Star, BookOpen, Clock, Edit2, Trash2 } from "lucide-react";
import { SvgPricingEdit, SvgPricingDeactivate } from "@/lib/icons";

interface CourseCardProps {
  title: string;
  image: string;
  lessons: number;
  hours: number;
  rating: number;
  reviews: number;
  price: string;
  status: "Active" | "Draft";
  onEdit?: () => void;
  onDeactivate?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  image,
  lessons,
  hours,
  rating,
  reviews,
  price,
  status,
  onEdit,
  onDeactivate,
}) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 flex flex-col h-full group transition-all duration-300 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${status === "Active" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
          {status}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5 text-yellow-400">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-xs text-slate-400">{rating} ({reviews})</span>
        </div>

        <div className="flex items-center justify-between text-slate-500 text-sm mb-6 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5">
            <BookOpen size={16} />
            <span>{lessons} Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{hours}h</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between mb-6">
          <span className="text-2xl font-black text-slate-900">{price}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onEdit}
            className="w-full p-3 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] rounded-[14px] flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <SvgPricingEdit className="w-5 h-5 flex-shrink-0 text-black" />
            <span className="text-black text-base font-semibold font-roboto">Edit Course</span>
          </button>
          
          <button
            onClick={onDeactivate}
            className="w-full p-3 rounded-[14px] border border-[#FF4D4F] flex items-center justify-center gap-2.5 transition-colors hover:bg-red-50 text-[#FF4D4F]"
          >
            <SvgPricingDeactivate className="w-5 h-5 flex-shrink-0" />
            <span className="text-base font-normal font-roboto">Delete Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};

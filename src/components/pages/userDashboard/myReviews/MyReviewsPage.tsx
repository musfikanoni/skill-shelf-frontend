"use client"

import * as React from "react"
import {
  Star,
  Edit2,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"


const reviews = [
  {
    id: 1,
    courseTitle: "Digital Marketing Mastery",
    rating: 5,
    date: "April 20, 2026",
    comment: "Excellent course! The content was well-structured and easy to follow. I learned so much about digital marketing strategies.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    isVerified: true
  },
  {
    id: 2,
    courseTitle: "Content Creation Pro",
    rating: 4,
    date: "April 15, 2026",
    comment: "Great course with practical examples. Would love to see more advanced techniques in future updates.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80",
    isVerified: true
  }
]

export default function MyReviewsPage() {
  const [selectedReview, setSelectedReview] = React.useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [rating, setRating] = React.useState(5)
  const [reviewText, setReviewText] = React.useState("")

  const openEditModal = (review: any) => {
    setSelectedReview(review)
    setRating(review.rating)
    setReviewText(review.comment)
    setIsEditModalOpen(true)
  }

  const getRatingLabel = (val: number) => {
    if (val >= 5) return "Excellent!"
    if (val >= 4) return "Very Good!"
    if (val >= 3) return "Good!"
    if (val >= 2) return "Fair"
    return "Poor"
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Banner */}
      <div className="bg-[#6C3FC5] rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">My Reviews</h1>
        <p className="text-white/80 font-medium mt-1">Manage your course reviews and ratings</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Reviews</p>
          <p className="text-3xl font-extrabold text-[#1E293B] mt-2">2</p>
        </Card>
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-extrabold text-[#1E293B]">4.5</p>
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </div>
        </Card>
        <Card className="bg-white border border-emerald-100 shadow-sm rounded-2xl p-6">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Verified Reviews</p>
          <p className="text-3xl font-extrabold text-emerald-500 mt-2">2</p>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8">
        <h2 className="text-xl font-extrabold text-[#1E293B] mb-8">Your Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="h-24 w-32 shrink-0 rounded-xl overflow-hidden shadow-sm">
                  <img src={review.image} alt={review.courseTitle} className="h-full w-full object-cover" />
                </div>

                {/* Review Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-[#1E293B]">{review.courseTitle}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-400">{review.date}</span>
                        {review.isVerified && (
                          <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-50 font-bold px-2 py-0.5 text-[10px] rounded-md flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg border-slate-100 text-slate-400 hover:text-[#6C3FC5] hover:bg-slate-50 transition-colors"
                        onClick={() => openEditModal(review)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Review Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="relative p-8 space-y-6">
            {/* <DialogClose className="absolute right-6 top-6 h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X className="h-4 w-4" />
            </DialogClose> */}

            {/* Header Content */}
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="h-16 w-16 bg-[#6C3FC5] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-extrabold text-[#1E293B]">Edit Your Review</DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">
                  {selectedReview?.courseTitle}
                </DialogDescription>
              </div>
            </div>

            {/* Star Rating Section */}
            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm font-bold text-[#1E293B]">Update your rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRating(val)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${val <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-100 fill-slate-100"}`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[#6C3FC5] font-extrabold text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {getRatingLabel(rating)}
              </div>
            </div>

            {/* Textarea Section */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#1E293B]">Update your review</p>
              <div className="relative">
                <textarea
                  className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-100 focus:border-[#6C3FC5] outline-none text-sm text-slate-600 font-medium resize-none transition-all"
                  placeholder="Share your updated thoughts about this course..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <p className="text-right text-[10px] font-bold text-slate-400 mt-1">
                  {reviewText.length} characters
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-slate-200 text-slate-600 font-extrabold hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-12 rounded-xl bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold shadow-lg transition-all cursor-pointer"
                onClick={() => setIsEditModalOpen(false)}
              >
                Update Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

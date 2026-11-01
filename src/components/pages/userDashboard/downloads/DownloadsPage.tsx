"use client";
import { useState, useEffect } from "react";

import {
  Download,
  Search,
  Infinity as InfinityIcon,
  PlusIcon,
  Star,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useCreateReviewMutation,
  useGetAllPurchasedProductQuery,
} from "@/redux/api/userDashboardApi/productApi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import Loading from "@/components/Others/Loading";

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewStatusMap, setReviewStatusMap] = useState<
    Record<string, boolean>
  >({});

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();

  const openEditModal = (product: any) => {
    setSelectedReview(product);
    setRating(5);
    setReviewText("");
    setIsModalOpen(true);
  };

  const getRatingLabel = (val: number) => {
    if (val >= 5) return "Excellent!";
    if (val >= 4) return "Very Good!";
    if (val >= 3) return "Good!";
    if (val >= 2) return "Fair";
    return "Poor";
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const reviewData = {
        itemId: selectedReview._id,
        itemType: "product",
        rating: rating,
        comment: reviewText,
      };

      const result = await createReview(reviewData).unwrap();

      setReviewStatusMap((prev) => ({
        ...prev,
        [selectedReview._id]: true,
      }));

      toast.success("Review submitted successfully!");
      setIsModalOpen(false);
      setRating(5);
      setReviewText("");
      setSelectedReview(null);
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast.error(
        error?.data?.message || "Failed to submit review. Please try again.",
      );
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isError } = useGetAllPurchasedProductQuery(
    debouncedSearchTerm || undefined,
  );
  const products = data?.data || [];

  useEffect(() => {
    const fetchReviewStatuses = async () => {
      if (!products.length) return;

      const statuses: Record<string, boolean> = {};

      for (const product of products) {
        try {
          const response = await fetch(
            `/api/review/can-review?itemId=${product._id}&itemType=product`,
          );
          const result = await response.json();
          statuses[product._id] = result.data?.canReview || false;
        } catch (error) {
          statuses[product._id] = false;
        }
      }

      setReviewStatusMap(statuses);
    };

    fetchReviewStatuses();
  }, [products]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to fetch products</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1E293B]">
            My Downloads
          </h1>
          <p className="text-slate-400 font-medium">
            Access and download your digital products and resources.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search files..."
            className="pl-10 h-11 border-slate-200 rounded-xl bg-white shadow-sm focus:ring-1 focus:ring-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Separator className="bg-[#6B7280] opacity-10 mb-8" />

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((item) => {
          const canReview = reviewStatusMap[item._id] || false;

          return (
            <Card
              key={item._id}
              className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-2xl flex flex-col h-full group"
            >
              {/* Image Section with Badges */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    item.images?.[0] ||
                    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
                  }
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className="bg-white/90 backdrop-blur-sm text-[#1E293B] hover:bg-white border-none font-bold px-2 py-0.5 text-[10px] rounded-md shadow-sm">
                    {item.category?.name || "Ebook"}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-[#1E293B] text-lg leading-tight group-hover:text-[#6C3FC5] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    Purchased on{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <InfinityIcon className="h-4 w-4" />
                    <span className="text-xs font-bold">Unlimited access</span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <div className="h-px bg-slate-100 w-full mb-6" />
                  <div className="flex items-end justify-betwee gap-3">
                    <div className="flex flex-col gap-2 w-full">
                      {item.files?.basic && (
                        <a
                          href={item.files.basic}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border-0 bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold rounded-xl h-11 shadow-md shadow-yellow-100 gap-2 cursor-pointer inline-flex items-center justify-center text-sm"
                        >
                          <Download className="h-5 w-5" />
                          Download Basic
                        </a>
                      )}
                      {item.files?.pro && (
                        <a
                          href={item.files.pro}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border-0 bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold rounded-xl h-11 shadow-md shadow-yellow-100 gap-2 cursor-pointer inline-flex items-center justify-center text-sm"
                        >
                          <Download className="h-5 w-5" />
                          Download Pro
                        </a>
                      )}
                      {item.files?.vip && (
                        <a
                          href={item.files.vip}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full border-0 bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold rounded-xl h-11 shadow-md shadow-yellow-100 gap-2 cursor-pointer inline-flex items-center justify-center text-sm"
                        >
                          <Download className="h-5 w-5" />
                          Download VIP
                        </a>
                      )}
                    </div>

                    {!canReview && (
                      <Button
                        onClick={() => openEditModal(item)}
                        variant={"outline"}
                        className="h-11 cursor-pointer"
                      >
                        <PlusIcon /> Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="relative p-8 space-y-6">
            {/* Header Content */}
            <div className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="h-16 w-16 bg-[#6C3FC5] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-extrabold text-[#1E293B]">
                  Your Review
                </DialogTitle>
                <DialogDescription className="text-slate-400 font-medium">
                  {selectedReview?.name}
                </DialogDescription>
              </div>
            </div>

            {/* Star Rating Section */}
            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm font-bold text-[#1E293B]">
                Give your rating
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRating(val)}
                    className="p-1 transition-transform hover:scale-110"
                    type="button"
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
              <p className="text-sm font-bold text-[#1E293B]">
                Give your feedback
              </p>
              <div className="relative">
                <textarea
                  className="w-full h-32 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-100 focus:border-[#6C3FC5] outline-none text-sm text-slate-600 font-medium resize-none transition-all"
                  placeholder="Share your thoughts about this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-slate-200 text-slate-600 font-extrabold hover:bg-slate-50 transition-all cursor-pointer"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                className="h-12 border-0 rounded-xl bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold shadow-lg transition-all cursor-pointer"
                onClick={handleSubmitReview}
                disabled={isCreating}
              >
                {isCreating ? "Submitting..." : "Submit review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

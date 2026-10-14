
export type EnrolledCoursesResponse = {
  data: EnrolledCourse[];
};

export type EnrolledCourse = {
  _id: string;

  course: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
  };

  totalVideos: number;
  totalDuration: number;
  completedVideos: number;
  watchedDuration: number;
  progress: number;

  isEnrolled: boolean;
  amount: number;

  createdAt: string;
};
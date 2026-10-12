import { LogIn, X } from "lucide-react";
import { useRouter } from "next/navigation";

function LoginRequiredModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleGoToLogin = () => {
    onClose();
    router.push("/signIn");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6E51E0]">
            <LogIn className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-semibold text-[#1D1D1D]">
          Sign In Required
        </h2>
        <p className="mb-8 text-center text-[#636F85] text-sm">
          You need to be signed in to purchase a subscription plan. Please log
          in or create an account to continue.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoToLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6E51E0] py-3 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-full border border-gray-200 bg-[#FBFBFB] py-3 text-sm font-medium text-[#2D2D2D] transition hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequiredModal;
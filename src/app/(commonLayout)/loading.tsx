import Loading from "@/components/Others/Loading";

export default function CommonLayoutLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <Loading size="lg" />
    </div>
  );
}

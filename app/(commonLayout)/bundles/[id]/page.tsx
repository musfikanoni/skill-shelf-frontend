import BundleDetails from '@/components/bundlesPage/BundleDetails';

const BundleDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      <BundleDetails id={id} />
    </div >
  )
}

export default BundleDetailsPage

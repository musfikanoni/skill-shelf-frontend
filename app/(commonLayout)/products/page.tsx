import ProductSection from '@/components/productsPage/ProductSection'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Image from 'next/image'

const ProductsPage = () => {
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/productImg.png"
            alt="product"
            width={40}
            height={40}
          />
        }
        title="PLR Products"
        description="Browse our collection of high-quality PLR products"
      />

      <ProductSection />

    </div >
  )
}

export default ProductsPage
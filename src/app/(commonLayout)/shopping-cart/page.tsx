import type { Metadata } from "next";
import CartPage from "@/components/shoppingCart/CartPage";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected SkillShelf items and proceed to checkout",
};

function ShoppingCart() {
  return (
    <div>
      <CartPage />
    </div>
  );
}

export default ShoppingCart;

import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useAppSelector } from "@/redux/hooks";
import { useAddToWishlistMutation } from "@/redux/services/wishlist/wishlist.api";
import { toast } from "sonner";

interface WishlistActionButtonProps {
  productId: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  // 🎯 thumbnail এর টাইপে string[] বা any যুক্ত করা হলো যাতে 'length' প্রপার্টি নিয়ে এরর না আসে
  thumbnail: string | string[] | null | undefined;
}

export default function WishlistActionButton({
  productId,
  name,
  originalPrice,
  salePrice,
  thumbnail,
}: WishlistActionButtonProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [addToWishlist, { isLoading: isWishlistLoading }] = useAddToWishlistMutation();

  const handleAddToWishlist = async () => {
    // 🎯 ইলেকট্রনিক্স বা ডেকোর যেকোনো জায়গা থেকে ছবি পাস হলে সেটি স্ট্রিং কি না চেক করা বা এক্সট্রাক্ট করা
    let resolvedThumbnail: string | null = null;
    if (typeof thumbnail === "string") {
      resolvedThumbnail = thumbnail;
    } else if (Array.isArray(thumbnail) && thumbnail.length > 0) {
      resolvedThumbnail = thumbnail[0];
    } else if (thumbnail && typeof thumbnail === "object" && "thumbnail" in thumbnail) {
      resolvedThumbnail = (thumbnail as { thumbnail?: string }).thumbnail ?? null;
    }

    if (!isAuthenticated) {
      const guestItem = {
        id: productId,
        name: name,
        slug: `product-${productId}`,
        thumbnail: resolvedThumbnail,
        price: originalPrice,
        sale_price: salePrice,
      };

      const existingWishlist = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
      const exists = existingWishlist.some((item: { id: number }) => item.id === productId);

      if (!exists) {
        existingWishlist.push(guestItem);
        localStorage.setItem("guest_wishlist", JSON.stringify(existingWishlist));
        toast.success("Product added to wishlist!");
      } else {
        toast.info("Product is already in your wishlist.");
      }
      return;
    }

    try {
      const res = await addToWishlist({ product_id: productId }).unwrap();
      toast.success(res.message || "Product saved to wishlist!");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToWishlist}
      disabled={isWishlistLoading}
      className="rounded-xl border border-gray-300 px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isWishlistLoading ? "Saving..." : "Add to Wishlist"}
    </button>
  );
}
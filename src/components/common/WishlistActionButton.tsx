import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useAppSelector } from "@/redux/hooks";
import { useAddToWishlistMutation } from "@/redux/services/wishlist/wishlist.api";
import { toast } from "sonner";

interface WishlistActionButtonProps {
  productId: number;
  category?: string;
  slug?: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  thumbnail: string | string[] | null | undefined;
}

export default function WishlistActionButton({
  productId,
  category,
  slug,
  name,
  originalPrice,
  salePrice,
  thumbnail,
}: WishlistActionButtonProps) {

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [addToWishlist, { isLoading: isWishlistLoading }] = useAddToWishlistMutation();


  const handleAddToWishlist = async () => {
    let resolvedThumbnail: string | null = null;

    if (typeof thumbnail === "string") {
      resolvedThumbnail = thumbnail;
    } else if (Array.isArray(thumbnail) && thumbnail.length > 0) {
      resolvedThumbnail = thumbnail[0];
    } else if (
      thumbnail &&
      typeof thumbnail === "object" &&
      "thumbnail" in thumbnail
    ) {
      resolvedThumbnail =
        (thumbnail as { thumbnail?: string }).thumbnail ?? null;
    }

    // Guest User
    if (!isAuthenticated) {
      try {
        const existingWishlist = JSON.parse(
          localStorage.getItem("guest_wishlist") || "[]"
        );

        const exists = existingWishlist.some(
          (item: { id: number }) => item.id === productId
        );

        let updatedWishlist;

        if (exists) {
          updatedWishlist = existingWishlist.filter(
            (item: { id: number }) => item.id !== productId
          );

          toast.success("Product removed from wishlist!");
        } else {
          const guestItem = {
            id: productId,
            category,
            name,
            slug,
            thumbnail: resolvedThumbnail,
            price: originalPrice,
            sale_price: salePrice,
          };

          updatedWishlist = [...existingWishlist, guestItem];

          toast.success("Product added to wishlist!");
        }

        localStorage.setItem(
          "guest_wishlist",
          JSON.stringify(updatedWishlist)
        );

        window.dispatchEvent(new Event("guest-wishlist-updated"));
      } catch {
        toast.error("Failed to update wishlist.");
      }

      return;
    }

    // Authenticated User
    try {
      const res = await addToWishlist({ product_id: productId }).unwrap();
      toast.success(res.message || "Wishlist updated successfully!");
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
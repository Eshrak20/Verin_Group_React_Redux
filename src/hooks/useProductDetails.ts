// src/hooks/useProductDetails.ts

import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product, ProductVariant } from "@/types/product.type";
import { useActiveCategory } from "@/utils/ActiveCategoryContext";

export function useProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveCategory } = useActiveCategory();

  const { data: response, isLoading } = useGetProductsQuery({ per_page: 100 });
  const products: Product[] = response?.data || [];
  const product = products.find((item) => item.slug === slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);

  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleBackNavigation = () => {
    if (location.state?.from) navigate(location.state.from);
    else if (window.history.length > 2) navigate(-1);
    else navigate("/decor");
  };

  const currentVariant = selectedVariant && product?.variants?.some(v => v.id === selectedVariant.id)
    ? selectedVariant 
    : product?.variants?.[0] || null;

  useEffect(() => {
    if (product) {
      setActiveCategory(product.category?.name || product.sub_category?.name || "Decor");
    }
    return () => setActiveCategory(null);
  }, [product, setActiveCategory]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100
    });
  };

  const price = Number(currentVariant?.price ?? 0);
  const salePrice = Number(currentVariant?.sale_price ?? 0);
  const hasDiscount = salePrice > 0 && salePrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

  const productImages = currentVariant?.images?.length
    ? currentVariant.images.map((img) => img.image_url)
    : [product?.thumbnail || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"];

  const currentPrice = hasDiscount ? salePrice : price;
  const whatsappMessage = product ? encodeURIComponent(`Hello, I am interested in this product.

Product Name: ${product.name}
Price: TK ${currentPrice.toLocaleString()}.00
Product URL: ${window.location.href}

Please provide more details.`) : "";

  return {
    product,
    slug,
    isLoading,
    currentVariant,
    setSelectedVariant,
    selectedImage,
    setSelectedImage,
    modalOpen,
    setModalOpen,
    zoomPos,
    isHovered,
    setIsHovered,
    imageRef,
    handleBackNavigation,
    handleMouseMove,
    price,
    salePrice,
    hasDiscount,
    discountPercent,
    productImages,
    whatsappMessage,
  };
}
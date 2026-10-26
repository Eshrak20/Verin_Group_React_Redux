export { cn } from "cn";

export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        remaining,
    ).padStart(2, "0")}`;
};

export interface WhatsAppRedirectOptions {
    productName: string;
    displayPrice: string | number;
}

export const redirectToWhatsApp = ({
    productName,
    displayPrice,
}: WhatsAppRedirectOptions) => {
    const phoneNumber = "8801805734585";
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    const message = [
        `Hello, I am interested in this product.`,
        ``,
        `Product Name: ${productName}`,
        `Price: TK ${displayPrice}.00`,
        `Product URL: ${currentUrl}`,
        ``,
        `Please provide more details.`,
    ].join("\n");

    window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
    );
};
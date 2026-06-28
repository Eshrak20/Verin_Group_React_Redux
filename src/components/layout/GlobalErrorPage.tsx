import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function GlobalErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404 - Page Not Found";
      message = "The page you are looking for doesn’t exist.";
    } else if (error.status === 500) {
      title = "500 - Internal Server Error";
      message = "Oops! Something went wrong on our end.";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 mb-8">{message}</p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
}

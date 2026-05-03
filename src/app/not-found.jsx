import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found | Swoo Tech Mart",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-teal-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Go Home
          </Link>
          <Link
            href="/store"
            className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Store
          </Link>
        </div>
      </div>
    </div>
  );
}

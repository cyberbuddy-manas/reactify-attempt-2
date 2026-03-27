import { AddRestaurantForm } from "@/components/AddRestaurantForm";
import Link from "next/link";

export default function AddRestaurantPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold text-zinc-900 tracking-tight">
          VTap
        </Link>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          ← Back
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-zinc-900 mb-1">New Restaurant</h1>
          <p className="text-sm text-zinc-500">Fill in the details to create a restaurant landing page.</p>
        </div>

        <AddRestaurantForm />
      </div>
    </div>
  );
}

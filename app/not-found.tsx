import Link from "next/link";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm my-8">
      <Car className="w-16 h-16 text-slate-300 mb-4 animate-pulse" />
      <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
        404 - Diecast Track Not Found
      </h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 font-medium">
        The car model or page you are looking for has taken a wrong turn or does not exist.
      </p>
      <Link
        href="/"
        className="bg-[#0256B3] hover:bg-blue-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow uppercase tracking-wider transition-all"
      >
        Return to Garage Home
      </Link>
    </div>
  );
}

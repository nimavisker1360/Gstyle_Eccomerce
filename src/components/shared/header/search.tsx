import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function Search() {
  return (
    <form
      action="/search"
      method="GET"
      className="flex items-stretch h-12 w-full"
    >
      <Input
        className="flex-1 rounded-l-lg rounded-r-none border-gray-300 bg-gray-100 text-gray-800 text-opacity-40 placeholder-opacity-30 text-base h-full focus:ring-2 focus:ring-green-500 focus:border-green-500 text-right"
        placeholder="هزاران محصول  را جستجو کنید"
        name="q"
        type="search"
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white rounded-r-lg rounded-l-none h-full px-6 py-2 transition-colors"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
}

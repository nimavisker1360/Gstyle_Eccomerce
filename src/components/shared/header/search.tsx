import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_NAME } from "@/lib/constants";
const categories = [
  "مد و پوشاک",
  "آرایش و زیبایی",
  "موبایل و کامپیوتر",
  "اسباب بازی و گجت",
  "حیوانات خانگی",
  "ویتامین و دارو",
];
export default async function Search() {
  return (
    <form
      action="/search"
      method="GET"
      className="flex items-stretch h-12 w-full"
    >
      <Input
        className="flex-1 rounded-l-lg rounded-r-none border-gray-300 bg-gray-100 text-gray-800 text-base h-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
        placeholder="Binlerce market ürünü içinde arayın"
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

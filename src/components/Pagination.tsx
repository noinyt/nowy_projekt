'use client';
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  baseUrl: string;
}

export function Pagination({ totalItems, pageSize, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link 
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-white border rounded hover:bg-gray-50 text-gray-400"
        >
          &larr; Poprzednia
        </Link>
      )}
      
      <span className="px-4 py-2 text-gray-400">
        Strona {currentPage} z {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link 
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-white border rounded hover:bg-gray-50 text-gray-400"
        >
          Następna &rarr;
        </Link>
      )}
    </div>
  );
}
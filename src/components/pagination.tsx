interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  
  export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )
  }
  
  
import React from "react";

const Pagination = ({ currentPage, totalPages, onPrev, onNext, onJump }) => {
  const MAX_VISIBLE_PAGES = 5; // Maximum number of visible pages before adding ellipses
  const pages = [];
  const isMobile = window.innerWidth <= 768; // Assuming mobile breakpoint is 768px

  // Function to generate pagination with ellipses
  const generatePagination = () => {
    if (totalPages <= MAX_VISIBLE_PAGES || isMobile) {
      // For mobile or small number of pages, show simplified pagination
      return [1, currentPage, totalPages];
    }

    // For larger screens, show extended pagination
    pages.push(1);

    const start = Math.max(currentPage - 1, 2);
    const end = Math.min(currentPage + 1, totalPages - 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex justify-center mt-4 overflow-x-auto">
      <nav aria-label="Page navigation">
        <ul className="inline-flex">
          <li>
            <button
              className={`h-10 px-5 transition-colors duration-150 ${
                currentPage <= 1
                  ? "bg-gray-300 text-gray-500"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } border border-r-0 border-indigo-600 rounded-l-lg`}
              onClick={onPrev}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              Prev
            </button>
          </li>
          {generatePagination().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="h-10 px-5 flex items-center text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  className={`h-10 px-5 transition-colors duration-150 ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-indigo-600 hover:bg-indigo-100"
                  }`}
                  onClick={() => onJump(page)}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          <li>
            <button
              className={`h-10 px-5 transition-colors duration-150 ${
                currentPage >= totalPages
                  ? "bg-gray-300 text-gray-500"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } border border-indigo-600 rounded-r-lg`}
              onClick={onNext}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
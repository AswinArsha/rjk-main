import React from 'react';

const Pagination = ({ currentPage, totalPages, onPrev, onNext, onJump }) => {
  return (
    <div className="flex justify-center mt-4">
      <nav aria-label="Page navigation">
        <ul className="inline-flex">
          <li>
            <button
              className={`h-10 px-5 transition-colors duration-150 ${
                currentPage <= 1 ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } border border-r-0 border-indigo-600 rounded-l-lg`}
              onClick={onPrev}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                className={`h-10 px-5 transition-colors duration-150 ${
                  currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-100'
                }`}
                onClick={() => onJump(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              className={`h-10 px-5 transition-colors duration-150 ${
                currentPage >= totalPages ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } border border-indigo-600 rounded-r-lg`}
              onClick={onNext}
              disabled={currentPage >= totalPages}
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

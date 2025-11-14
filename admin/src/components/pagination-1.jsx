import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function Pagination1({
  maxVisible = 5,
  totalPages,
  setCurrentPage,
  currentPage,
}) {
  let startPage, endPage;
  if (totalPages <= maxVisible + 1) {
    startPage = 1;
    endPage = totalPages - 1;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = maxVisible;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxVisible;
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const onPageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageClick(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > 1 && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                isActive={totalPages === currentPage}
                onClick={() => onPageClick(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function MobilePagination1({
  maxVisible = 5,
  totalPages,
  setCurrentPage,
  currentPage,
}) {
  let startPage, endPage;
  if (totalPages <= maxVisible + 1) {
    startPage = 1;
    endPage = totalPages - 1;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = maxVisible;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxVisible;
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const onPageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            className="text-white"
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageClick(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > 1 && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis className="text-white/50" />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                isActive={totalPages === currentPage}
                onClick={() => onPageClick(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            className="text-white"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { Pagination1, MobilePagination1 };

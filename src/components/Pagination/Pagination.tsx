import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  currentPage?: number;
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  onPageChange,
  currentPage = 1,
}: PaginationProps) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  
  if (pageCount <= 1) {
    return null;
  }

  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected + 1);
  };

  return (
    <ReactPaginate
      previousLabel={"⇽"}
      nextLabel={"⇾"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={css.pagination}
      activeClassName={css.active}
      forcePage={currentPage - 1}
    />
  );
}
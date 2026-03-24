import '../styles/PageOptions.css';

export type PageOptionsProps = {
  pageNumber: number;
  totalPages: number;
  pagesize: number;
  onPageChange: (page: number) => void;
  onPagesizeChange: (size: number) => void;
};

function PageOptions({
  pageNumber,
  totalPages,
  pagesize,
  onPageChange,
  onPagesizeChange,
}: PageOptionsProps) {
  return (
    <div className="page-options mt-4 pt-3 border-top border-secondary">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm page-options__control-btn"
          disabled={pageNumber === 1}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isSelected = pageNumber === page;
          return (
            <button
              type="button"
              key={page}
              className={`btn btn-sm ${isSelected ? 'page-options__page-btn--selected' : 'page-options__control-btn'}`}
              onClick={() => onPageChange(page)}
              disabled={isSelected}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="btn btn-sm page-options__control-btn"
          disabled={pageNumber === totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
        </button>

        <label
          className="small mb-0 ms-2 page-options__results-label"
          htmlFor="books-results-per-page"
        >
          Results
        </label>
        <select
          id="books-results-per-page"
          className="form-select form-select-sm page-options__results-select"
          value={pagesize}
          onChange={(e) => {
            onPagesizeChange(Number(e.target.value));
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default PageOptions;

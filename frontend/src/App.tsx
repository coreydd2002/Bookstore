import { useState, type CSSProperties } from 'react';
import './App.css';
import BookList from './BookList';
import CategoryFilter from './CatergoryFilter';

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pagesize, setPagesize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const pageBtnUnselectedStyle: CSSProperties = {
    backgroundColor: '#e5e7eb',
    color: '#1e3a8a',
    borderColor: '#e5e7eb',
    opacity: 1, // keep visible even when disabled by React
  };

  const pageBtnSelectedStyle: CSSProperties = {
    backgroundColor: '#60a5fa',
    color: '#ffffff',
    borderColor: '#60a5fa',
    opacity: 1,
  };

  return (
    <div className="app-shell bg-body text-body">
      <header
        className="shadow-sm py-3 px-4"
        style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}
      >
        <div className="d-flex align-items-center justify-content-between gap-3">
          <h1 className="h4 mb-0 fw-semibold">Book List</h1>

          <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm"
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              style={pageBtnUnselectedStyle}
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
                  className="btn btn-sm"
                  onClick={() => setPageNumber(page)}
                  disabled={isSelected}
                  style={isSelected ? pageBtnSelectedStyle : pageBtnUnselectedStyle}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className="btn btn-sm"
              disabled={pageNumber === totalPages}
              onClick={() => setPageNumber(pageNumber + 1)}
              style={pageBtnUnselectedStyle}
            >
              Next
            </button>

            <label className="small mb-0 ms-2" style={{ color: '#ffffff' }}>
              Results
            </label>
            <select
              className="form-select form-select-sm"
              value={pagesize}
              onChange={(p) => {
                setPagesize(Number(p.target.value));
                setPageNumber(1);
              }}
              style={{
                backgroundColor: '#e5e7eb',
                color: '#1e3a8a',
                borderColor: '#e5e7eb',
                opacity: 1,
                width: 92,
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar bg-body-secondary">
          <div className="p-3 p-lg-4 h-100">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </aside>

        <main className="app-main-scroll">
          <div className="p-3 p-lg-4">
            <BookList
              selectedCategories={selectedCategories}
              pageNumber={pageNumber}
              pagesize={pagesize}
              onTotalPages={setTotalPages}
            />
          </div>
        </main>
      </div>

      <footer className="border-top border-secondary py-2 px-3 text-center text-body-secondary app-footer-discrete">
        Corey Dickson
      </footer>
    </div>
  );
}

export default App;

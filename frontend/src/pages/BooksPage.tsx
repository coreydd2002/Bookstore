import { useState } from 'react';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CatergoryFilter';
import PageOptions from '../components/PageOptions';
import '../styles/BooksPage.css';

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pagesize, setPagesize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  return (
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
          <PageOptions
            pageNumber={pageNumber}
            totalPages={totalPages}
            pagesize={pagesize}
            onPageChange={setPageNumber}
            onPagesizeChange={(size) => {
              setPagesize(size);
              setPageNumber(1);
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default BooksPage;

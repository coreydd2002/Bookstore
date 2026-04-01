import { useEffect, useState } from 'react';
import '../styles/CatergoryFilter.css';
import { fetchBookCategories } from '../../api/BooksAPI';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchBookCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  function handleCheckBoxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((c) => c !== target.value)
      : [...selectedCategories, target.value];
    setSelectedCategories(updatedCategories);
  }

  return (
    <div>
      <h2 className="h6 text-uppercase text-body-secondary fw-semibold mb-3">
        Book Categories
      </h2>
      <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
        {categories.map((c) => (
          <li key={c}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={c}
                name={c}
                value={c}
                onChange={handleCheckBoxChange}
              />
              <label className="form-check-label small" htmlFor={c}>
                {c}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryFilter;

import { FiSearch } from 'react-icons/fi';
import { getSearchRecommendations } from '../utils/searchRecommendations';

const SearchSuggestions = ({ query, visible, onSelect }) => {
  if (!visible) return null;

  const recommendations = getSearchRecommendations(query);
  if (recommendations.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-[80] mt-2 overflow-hidden rounded-xl border border-borderSoft bg-card shadow-xl">
      <div className="border-b border-borderSoft px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Recommended searches
      </div>
      {recommendations.slice(0, 5).map((item) => (
        <button
          key={item}
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(item);
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-textDark transition-colors hover:bg-surfaceMuted hover:text-primary"
        >
          <FiSearch className="h-4 w-4 flex-shrink-0 text-muted" />
          <span className="truncate">{item}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;

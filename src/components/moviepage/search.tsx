import React from "react";
import genres from "../genres";
interface SessionSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}
const Search: React.FC<SessionSearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
}) => {
  return (
    <div className="container">
      <div className="row g-2 mb-3 align-items-center">
        {/* Search by Title Input */}
        <div className="col-12 col-lg-5 col-md-3" style={{ width: '300px', marginLeft: "50px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Genre Dropdown */}
       <div className="col-12 col-md-2" style={{ width: '300px', marginLeft: "100px" }}>
          <select
            className="form-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">-- Select Genre --</option>
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Search;
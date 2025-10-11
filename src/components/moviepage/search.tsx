import React from "react";
import Select from "react-select";
import genres from "../genres";

interface SessionSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
}

const selectOptions = [
  { value: "", label: "All Genres" }, 
  ...genres.map(genre => ({
    value: genre.value,
    label: genre.name
  }))
];


const Search: React.FC<SessionSearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
}) => {
  return (
    <div className="container">
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-lg-5 col-md-3" style={{ width: '300px'  }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2" style={{ width: '300px' }}>
          <Select
            placeholder={"All Genres"}
            options={selectOptions}
            value={selectOptions.find(option => option.value === selectedGenre)}
            onChange={(selectedOption) => setSelectedGenre(selectedOption?.value || "")}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;

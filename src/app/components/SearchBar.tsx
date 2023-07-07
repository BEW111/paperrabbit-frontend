import React, { useState } from "react";

import axios from "axios";

import { searchArxiv, convertApiGraphToVisGraph } from "../utils";
import { API_URL } from "../constants";
import { defaultPopupState } from "./PaperPopup";

import { BiX } from "react-icons/bi";
import LoadingIcon from "./icons/LoadingIcon";
import SearchIcon from "./icons/SearchIcon";

const SearchResultComponent = (props) => {
  const onAddResult = async () => {
    props.setSearchResultsLoading(true);
    props.closeSearchResults();

    const link = props.arxivId;
    const match = link.match(/abs\/(\d+\.\d+)/);

    if (match) {
      const nodeResults = (await axios.get(`${API_URL}/${match[1]}`)).data;
      const newGraph = await convertApiGraphToVisGraph(nodeResults);
      props.setGraphData(newGraph);
    } else {
      console.log("Error in extracting ID");
    }
    props.setSearchResultsLoading(false);
  };

  return (
    <div className="flex border-t border-t-black p-3">
      <div className="flex-1 ">
        <b className="hover:underline">
          <a target="_blank" href={props.arxivId}>
            {props.title}
          </a>
        </b>
        <p className="line-clamp-2">{props.summary}</p>
      </div>
      <div className="flex w-24 items-center justify-center">
        <button onClick={onAddResult}>Add</button>
      </div>
    </div>
  );
};

type SearchResult = {
  id: string | null;
  title: string | null;
  summary: string | null;
  published: string | null;
  doi: string | null;
};

const SearchBar = ({ setGraphData, setPaperPopup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);

  const onSubmitSearch = async () => {
    const query = searchTerm;
    setSearchResultsLoading(true);

    const results: Array<SearchResult> = await searchArxiv(query);
    setSearchResults(results);
    setSearchResultsLoading(false);

    setPaperPopup(defaultPopupState);
  };

  const closeSearchResults = () => {
    setSearchResults([]);
  };

  return (
    <div className="pointer-events-none relative flex h-full w-2/3 flex-col gap-6 py-6">
      <div className="flex h-24 items-center">
        <form
          className="pointer-events-auto w-full"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitSearch();
          }}
        >
          <label className="sr-only mb-2 text-sm font-medium text-gray-900">
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              {searchResultsLoading ? <LoadingIcon /> : <SearchIcon />}
            </div>
            <input
              type="search"
              id="paper-search"
              className="block w-full rounded-lg border-2 border-gray-900 bg-amber-100 p-4 pl-14 text-lg text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-0"
              placeholder="Search for any ArXiv paper"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>
      {searchResults.length > 0 && (
        <div
          id="results"
          className="pointer-events-auto flex w-full flex-col overflow-hidden rounded-lg border-2 border-gray-900 bg-amber-100"
        >
          <div className="flex w-full items-end justify-end p-2">
            <BiX
              className="cursor-pointer"
              size={24}
              onClick={closeSearchResults}
            />
          </div>
          <div className="w-full overflow-scroll">
            {searchResults.map((result) => (
              <SearchResultComponent
                key={result.id}
                arxivId={result.id}
                title={result.title}
                summary={result.summary}
                closeSearchResults={closeSearchResults}
                setGraphData={setGraphData}
                setSearchResultsLoading={setSearchResultsLoading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

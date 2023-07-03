import React, { useState, useEffect } from "react";

import { BiX } from "react-icons/bi";
import axios from "axios";

import { searchArxiv } from "./utils";
import { defaultPopupState } from "./PaperPopup";

const API_URL = "https://paperrabbit.fly.dev";

const SearchResultComponent = ({ setSearchResultsLoading, closeSearchResults, arxivId, addNode, clearGraph, title, summary }) => {  
  const onAddResult = async () => {
    clearGraph();

    setSearchResultsLoading(true);
    closeSearchResults();

    const link = arxivId;
    const match = link.match(/abs\/(\d+\.\d+)/);

    if (!match) {
      console.error("Error in extracting ID");
      setSearchResultsLoading(false);
      return;
    }
    
    const response = await fetch(`${API_URL}/${match[1]}`);
    if (!response.ok || !response.body) {
      console.error(`Error in fetching data from API (status: ${response.status}) for ${match[1]}`);
      setSearchResultsLoading(false);
      return;
    }

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; 
      console.error(String.fromCharCode(...value)) // NOTE: need to use console.error because console.log is being overriden
      const { node, edge } = JSON.parse(String.fromCharCode(...value));
      addNode(node, edge);
    }
    
    setSearchResultsLoading(false);
  };

  return (
    <div className="flex border-t border-t-black p-3">
      <div className="flex-1 ">
        <b className="hover:underline">
          <a target="_blank" href={arxivId}>
            {title}
          </a>
        </b>
        <p className="line-clamp-2">{summary}</p>
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

const SearchBar = ({ addNode, clearGraph, setPaperPopup }) => {
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
              {searchResultsLoading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              )}
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
                addNode={addNode}
                clearGraph={clearGraph}
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

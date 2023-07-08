import axios from "axios";
import _ from "lodash";

import { BACKEND_API_URL, MAX_ARXIV_SEARCH_RESULTS } from "./constants";
import { ApiNode, ApiEdge, GraphNode, GraphEdge } from "./types/graph";
import { addNode, addEdge, clearGraph } from "./redux/graphSlice";
import { addPaper } from "./redux/paperSlice";
import { AppDispatch } from "./redux/store";
import { Quiz, isQuiz } from "./types/popup";

// Retrieves papers from the arxiv api
export const searchArxiv = async (query) => {
  try {
    console.log(axios.defaults.headers);
    const response = await axios.get("https://export.arxiv.org/api/query", {
      params: {
        search_query: `ti:${query} AND cat:cs.LG`, // searches in all fields
        start: 0, // starting index
        max_results: MAX_ARXIV_SEARCH_RESULTS, // number of results to fetch
      },
    });

    // Parse the xml data
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, "text/xml");

    // Iterate over each entry and extract the necessary details
    const entries = Array.from(xml.getElementsByTagName("entry"));
    const paperData = entries.map((entry) => {
      const id = entry.getElementsByTagName("id")[0]?.textContent;
      const title = entry.getElementsByTagName("title")[0]?.textContent;
      const summary = entry.getElementsByTagName("summary")[0]?.textContent;
      const published = entry.getElementsByTagName("published")[0]?.textContent;
      const links = Array.from(entry.getElementsByTagName("link"));

      // Find the DOI
      const doiLink = links.find(
        (link) => link.getAttribute("title") === "doi"
      );
      const doi = doiLink ? doiLink.getAttribute("href") : "DOI not available";

      return { id, title, summary, published, doi };
    });

    return paperData;
  } catch (error) {
    console.error(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in Node.js
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
    }
    console.error(error.config);
  }
};

// Gets the quiz data for a certain paper, should only be run if no cached data
export const getQuizData = async (articleId) => {
  const response = await axios.get(BACKEND_API_URL + "/questions/" + articleId);

  if (isQuiz(response.data)) {
    return response.data as Quiz;
  } else {
    console.error(response);
    throw Error("Error validating quiz data from backend:\n" + response.data);
  }
};

// Streams the graph data for a paper
export const streamGraphData = async (
  articleId: string,
  articleTitle: string,
  dispatch: AppDispatch
) => {
  // Clear current graph
  dispatch(clearGraph());

  // Add the very first node (not returned in API)
  const firstNode: GraphNode = {
    id: articleId,
    label: articleTitle,
  };
  dispatch(addNode(firstNode));
  dispatch(addPaper(articleId));

  const response = await fetch(BACKEND_API_URL + "/" + articleId);
  if (!response.ok || !response.body)
    throw Error(
      `Error in fetching data from API (status: ${response.status}) for ${articleId}`
    );

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Read new node from API
    // Will be a json with "node" and "edge" objects
    type ApiNodeEdgePair = {
      node: ApiNode;
      edge: ApiEdge;
    };
    const { node, edge }: ApiNodeEdgePair = JSON.parse(
      String.fromCharCode(...value)
    );

    // Convert to form to be stored in the api
    const newNode: GraphNode = {
      id: node.id,
      label: node.title,
    };

    const newEdge: GraphEdge = {
      from: edge[0],
      label: edge[1],
      to: edge[2],
      arrows: "to",
    };

    dispatch(addNode(newNode));
    dispatch(addEdge(newEdge));
    dispatch(addPaper(node.id));
  }
};

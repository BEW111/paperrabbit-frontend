import axios from "axios";
import _ from "lodash";

import { BACKEND_API_URL, MAX_ARXIV_SEARCH_RESULTS } from "./constants";
import { ApiNode, ApiEdge, GraphNode, GraphEdge } from "./types/graph";
import { addNode, addEdge } from "./redux/graphSlice";
import { AppDispatch } from "./redux/store";

export const searchArxiv = async (query) => {
  try {
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
    console.error("Error fetching data:", error);
    return [];
  }
};

export const getQuizData = async (articleId) => {
  // Check for cached quiz data

  // Api call goes here
  const fakeQuizData = {
    answer: "B. Energy density",
    options: [
      "A. Constitutive parameters",
      "B. Energy density",
      "C. Momentum density",
      "D. Energy flux",
    ],
    question: "What is the Energy Momentum Tensor related to?",
  };

  return fakeQuizData;
};

export const streamGraphData = async (
  articleId: string,
  articleTitle: string,
  dispatch: AppDispatch
) => {
  // Add the very first node (not returned in API)
  const firstNode: GraphNode = {
    id: articleId,
    label: articleTitle,
  };
  dispatch(addNode(firstNode));

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
  }
};

// export const convertApiGraphToVisGraph =

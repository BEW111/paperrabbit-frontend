import axios from "axios";
import _ from "lodash";

const MAX_SEARCH_RESULTS = 10;

export const searchArxiv = async (query) => {
  try {
    const response = await axios.get("https://export.arxiv.org/api/query", {
      params: {
        search_query: `ti:${query} AND cat:cs.LG`, // searches in all fields
        start: 0, // starting index
        max_results: MAX_SEARCH_RESULTS, // number of results to fetch
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

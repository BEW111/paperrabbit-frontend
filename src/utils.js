import axios from "axios";

const MAX_SEARCH_RESULTS = 10;

export const fetchArxivTitle = async (articleId) => {
  try {
    const response = await axios.get(
      `https://export.arxiv.org/api/query?id_list=${articleId}`
    );

    // Parse the xml data
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.data, "text/xml");

    // Extract the title and summary
    const title = xml.getElementsByTagName("title")[1]?.textContent;
    const summary = xml.getElementsByTagName("summary")[0]?.textContent;

    console.log(`Title: ${title}`);
    console.log(`Summary: ${summary}`);
    return title;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const convertApiGraphToG6Graph = async (apiGraph) => {
  let newData = {
    nodes: apiGraph.nodes.map(async (id) => ({
      id: id,
      label: await fetchArxivTitle(id),
    })),
    edges: apiGraph.edges.map((triple) => ({
      source: triple[0],
      target: triple[2],
    })),
  };

  return newData;
};

export const searchArxiv = async (query) => {
  try {
    const response = await axios.get("https://export.arxiv.org/api/query", {
      params: {
        search_query: `ti:${query}`, // searches in all fields
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

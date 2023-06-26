import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";

const STROKE_COLOR = "#111827";
const STROKE_HOVER_COLOR = "#f59e0b";
const NODE_FILL_COLOR = "#fff7ed";
const NODE_FILL_HOVER_COLOR = "#ffedd5";
const TEXT_COLOR = "black";

function Graph(props) {
  const { graphData, setPaperPopup } = props;
  const domNode = useRef(null);
  let network = null;

  const handleSelectNode = (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const clickedNode = graphData.nodes.find((node) => node.id === nodeId);

      if (clickedNode) {
        setPaperPopup({
          id: clickedNode.id,
          label: clickedNode.label,
        });
        network.body.data.nodes.update(clickedNode);
      }
    }
  };

  useEffect(() => {
    console.log(graphData);
    const nodesDataset = new DataSet(graphData.nodes);
    const edgesDataset = new DataSet(graphData.edges);

    const data = {
      nodes: nodesDataset,
      edges: edgesDataset,
    };

    const options = {
      interaction: {
        hover: true,
      },
      nodes: {
        shape: "box",
        color: {
          border: STROKE_COLOR,
          background: NODE_FILL_COLOR,
          highlight: {
            border: STROKE_HOVER_COLOR,
            background: "red",
          },
          hover: {
            border: "black",
            background: NODE_FILL_HOVER_COLOR,
          },
        },
        scaling: {
          label: {
            enabled: true,
            min: 8,
            max: 30,
          },
        },
      },
    };

    network = new Network(domNode.current, data, options);
    network.on("click", handleSelectNode);
  }, [graphData]);

  return (
    <div
      ref={domNode}
      style={{ width: window.outerWidth, height: window.outerHeight }}
    ></div>
  );
}

export default Graph;

import React, { useEffect, useRef } from "react";
import { Network, Options } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";

const STROKE_COLOR = "#111827"; // gray-900
const STROKE_HOVER_COLOR = "#f59e0b"; // amber-500
const STROKE_SELECT_COLOR = "#1e3a8a"; // blue-900
const NODE_FILL_COLOR = "#fffbeb"; // amber-50
const NODE_FILL_HOVER_COLOR = "#fef3c7"; // amber-100
const NODE_FILL_SELECT_COLOR = "#bfdbfe"; // blue-200
const TEXT_COLOR = "black";

function Graph(props) {
  const { graphData, setPaperPopup } = props;
  const domNode = useRef<HTMLElement | null>(null);
  let network: Network | null = null;

  const handleSelectNode = (params) => {
    if (params.nodes.length > 0 && network) {
      const nodeId = params.nodes[0];
      const clickedNode = graphData.nodes.find((node) => node.id === nodeId);

      if (clickedNode) {
        setPaperPopup({
          id: clickedNode.id,
          label: clickedNode.label,
        });
      }
    }
  };
  const handleHoverNode = (params) => {
    if (network) {
      network.canvas.body.container.style.cursor = "pointer";
    }
  };
  const handleBlurNode = (params) => {
    if (network) {
      network.canvas.body.container.style.cursor = "move";
    }
  };

  useEffect(() => {
    const nodesDataset = new DataSet(graphData.nodes);
    const edgesDataset = new DataSet(graphData.edges);

    const data = {
      nodes: nodesDataset,
      edges: edgesDataset,
    };

    const options: Options = {
      nodes: {
        shape: "box",
        color: {
          border: STROKE_COLOR,
          background: NODE_FILL_COLOR,
          hover: {
            border: STROKE_HOVER_COLOR,
            background: NODE_FILL_HOVER_COLOR,
          },
          highlight: {
            border: STROKE_SELECT_COLOR,
            background: NODE_FILL_SELECT_COLOR,
          },
        },
        scaling: {
          label: {
            enabled: true,
            min: 8,
            max: 30,
          },
        },
        widthConstraint: {
          minimum: 100,
          maximum: 300,
        },
      },
      interaction: {
        hover: true,
      },
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          springLength: 150,
          gravitationalConstant: -100,
        },
      },
    };

    network = new Network(domNode.current, data, options);
    network.on("click", handleSelectNode);
    network.on("hoverNode", handleHoverNode);
    network.on("blurNode", handleBlurNode);
  }, [graphData]);

  return (
    <div
      ref={domNode}
      style={{ width: window.outerWidth, height: window.outerHeight }}
    ></div>
  );
}

export default Graph;

// This component uses the Network component from vis-network to render
// The graph is rendered using a ref and is updated in the effect hook
// We store the nodes and edges with Redux, but update a local copy (just adding/removing)
// Upon detecting changes to the graph

import React, { useEffect, useRef, useState } from "react";
import { Network, Options } from "vis-network";
import _ from "lodash";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectGraphData } from "../redux/graphSlice";
import { openOrUpdatePopup } from "../redux/popupSlice";
import { GraphNode, GraphEdge, GraphData } from "../types/graph";

const STROKE_COLOR = "#111827"; // gray-900
const STROKE_HOVER_COLOR = "#f59e0b"; // amber-500
const STROKE_SELECT_COLOR = "#1e3a8a"; // blue-900
const NODE_FILL_COLOR = "#fffbeb"; // amber-50
const NODE_FILL_HOVER_COLOR = "#fef3c7"; // amber-100
const NODE_FILL_SELECT_COLOR = "#bfdbfe"; // blue-200
const TEXT_COLOR = "black";

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
    labelHighlightBold: false,
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
  edges: {
    font: {
      color: STROKE_COLOR,
      strokeColor: "#ffffff",
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

function Graph() {
  const graphData = useAppSelector(selectGraphData);
  const dispatch = useAppDispatch();

  // Locally stored nodes/edges
  const [addedNodes, setAddedNodes] = useState<GraphNode[]>([]);
  const [addedEdges, setAddedEdges] = useState<GraphEdge[]>([]);

  // Refs
  const networkContainerRef = useRef<HTMLElement | null>(null);
  const networkInstanceRef = useRef<Network | null>(null);
  const addedNodesRef = useRef<GraphNode[]>([]);

  useEffect(() => {
    addedNodesRef.current = addedNodes;
  }, [addedNodes]);

  // Node interations
  const handleSelectNode = (params) => {
    if (params.nodes.length > 0 && networkInstanceRef) {
      const nodeId = params.nodes[0];
      const clickedNode = addedNodesRef.current.find(
        (node) => node.id === nodeId
      );

      if (clickedNode) {
        dispatch(
          openOrUpdatePopup({
            id: clickedNode.id,
            label: clickedNode.label,
            mode: "notes",
          })
        );
      }
    }
  };
  const handleHoverNode = (params) => {
    if (networkInstanceRef) {
      networkInstanceRef.current.canvas.body.container.style.cursor = "pointer";
    }
  };
  const handleBlurNode = (params) => {
    if (networkInstanceRef) {
      networkInstanceRef.current.canvas.body.container.style.cursor = "move";
    }
  };

  useEffect(() => {
    // Initialize graph data
    const initGraphData = {
      nodes: addedNodes,
      edges: addedEdges,
    };

    networkInstanceRef.current = new Network(
      networkContainerRef.current,
      initGraphData,
      options
    );
    networkInstanceRef.current.on("click", handleSelectNode);
    networkInstanceRef.current.on("hoverNode", handleHoverNode);
    networkInstanceRef.current.on("blurNode", handleBlurNode);

    return () => {
      networkInstanceRef.current.off("click", handleSelectNode);
      networkInstanceRef.current.off("hoverNode", handleHoverNode);
      networkInstanceRef.current.off("blurNode", handleBlurNode);
    };
  }, []);

  // Update the graph data
  useEffect(() => {
    // Check if graph was reset
    if (graphData.nodes.length == 0) {
      setAddedNodes([]);
      setAddedEdges([]);
    }

    // Update nodes
    const newNodes = graphData.nodes.filter(
      (node) => !addedNodes.some((addedNode) => addedNode.id === node.id)
    );
    newNodes.forEach((node) => {
      networkInstanceRef.current.body.data.nodes.add(node);
    });
    setAddedNodes([...addedNodes, ...newNodes]);

    // Update edges
    const newEdges = JSON.parse(JSON.stringify(graphData)).edges.filter(
      (edge) =>
        !addedEdges.some(
          (addedEdge) =>
            addedEdge.from === edge.from &&
            addedEdge.to === edge.to &&
            addedEdge.label === edge.label
        )
    );
    newEdges.forEach((edge) => {
      networkInstanceRef.current.body.data.edges.add(edge);
    });
    setAddedEdges([...addedEdges, ...newEdges]);
  }, [graphData]);

  return (
    <div
      ref={networkContainerRef}
      style={{ width: window.outerWidth, height: window.outerHeight }}
    />
  );
}

export default Graph;

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";

const STROKE_COLOR = "#111827";
const STROKE_HOVER_COLOR = "#f59e0b";
const NODE_FILL_COLOR = "#fff7ed";
const NODE_FILL_HOVER_COLOR = "#ffedd5";
const TEXT_COLOR = "black";

G6.registerNode("rabbit-node", {
  draw: (cfg, group) => {
    const label = cfg.label;
    const labelLength = label.length;
    const rectWidth = labelLength * 14 + 20; // tweak this value based on your font size

    // now we add the rectangle and the text to the container
    const keyShape = group.addShape("rect", {
      attrs: {
        x: -rectWidth / 2, // positions the rect correctly
        y: -15,
        width: rectWidth,
        height: 35,
        fill: NODE_FILL_COLOR,
        stroke: STROKE_COLOR,
        lineWidth: 2,
        radius: 8,
      },
      draggable: true,
    });

    group.addShape("text", {
      attrs: {
        x: 0,
        y: 3,
        textAlign: "center",
        textBaseline: "middle",
        text: label,
        fill: TEXT_COLOR,
        fontSize: 20,
        capture: false,
      },
      draggable: true,
    });

    return keyShape;
  },
  setState: function setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get("children")[0]; // get the keyShape which is the first child
    const selectStyles = () => {
      shape.attr("fill", NODE_FILL_HOVER_COLOR);
      shape.attr("stroke", STROKE_HOVER_COLOR);
    };
    const unselectStyles = () => {
      shape.attr("fill", NODE_FILL_COLOR);
      shape.attr("stroke", STROKE_COLOR);
    };
    selectStyles();
    if (!value) {
      unselectStyles();
    }
  },
});

const RabbitGraph = ({ data, setPaperPopup }) => {
  const graphRef = React.useRef(null);
  let graph = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(graphRef.current),
        width: window.screen.width,
        height: 800,
        modes: {
          default: ["drag-canvas", "drag-node"],
        },
        layout: {
          type: "force",
          preventOverlap: true,
          linkDistance: 196,
          direction: "LR",
        },
        defaultNode: {
          type: "rabbit-node",
          labelCfg: {
            style: {
              fontSize: 20,
            },
          },
        },
        defaultEdge: {
          type: "cubic",
          style: {
            endArrow: true,
            lineWidth: 2,
            stroke: STROKE_COLOR,
          },
        },
      });

      graph.data(data);
      graph.render();

      // Mouse enter a node
      graph.on("node:mouseenter", (e) => {
        const nodeItem = e.item; // Get the target item
        graph.get("canvas").setCursor("pointer");
        graph.setItemState(nodeItem, "hover", true); // Set the state 'hover' of the item to be true
      });

      // Mouse leave a node
      graph.on("node:mouseleave", (e) => {
        const nodeItem = e.item; // Get the target item
        graph.get("canvas").setCursor("default");
        graph.setItemState(nodeItem, "hover", false); // Set the state 'hover' of the item to be false
      });

      // Click a node
      graph.on("node:click", (e) => {
        // Swich the 'click' state of the node to be false
        const clickNodes = graph.findAllByState("node", "click");
        clickNodes.forEach((cn) => {
          graph.setItemState(cn, "click", false);
        });
        const nodeItem = e.item; // et the clicked item
        graph.setItemState(nodeItem, "click", true); // Set the state 'click' of the item to be true

        const nodeData = e.item.getModel();

        // Set paper popup
        setPaperPopup({
          id: nodeData.id,
          label: nodeData.label,
        });
      });

      // Click an edge
      graph.on("edge:click", (e) => {
        // Swich the 'click' state of the edge to be false
        const clickEdges = graph.findAllByState("edge", "click");
        clickEdges.forEach((ce) => {
          graph.setItemState(ce, "click", false);
        });
        const edgeItem = e.item; // Get the clicked item
        graph.setItemState(edgeItem, "click", true); // Set the state 'click' of the item to be true
      });
    } else {
      graph.changeData(data);
    }

    return () => {
      // Cleanup function
      graph.destroy();
      graph = null;
    };
  }, [data]);

  return <div ref={graphRef}></div>;
};

export default RabbitGraph;

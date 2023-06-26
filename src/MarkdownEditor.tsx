import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { css } from "@emotion/css";

const MarkdownPreviewExample = () => {
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const containerRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(0);

  const decorate = useCallback(([node, path]) => {
    const ranges = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l, t) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div className="h-full w-full" ref={containerRef}>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="outline-none"
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Write some markdown..."
          style={{
            minHeight: `${containerHeight}px`,
          }}
        />
      </Slate>
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && "bold"};
        font-style: ${leaf.italic && "italic"};
        text-decoration: ${leaf.underlined && "underline"};
        ${leaf.title &&
        css`
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          margin: 20px 0 10px 0;
        `}
        ${leaf.list &&
        css`
          padding-left: 10px;
          font-size: 20px;
          line-height: 10px;
        `}
        ${leaf.hr &&
        css`
          display: block;
          text-align: center;
          border-bottom: 2px solid #ddd;
        `}
        ${leaf.blockquote &&
        css`
          display: inline-block;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          color: #aaa;
          font-style: italic;
        `}
        ${leaf.code &&
        css`
          font-family: monospace;
          background-color: #eee;
          padding: 3px;
        `}
      `}
    >
      {children}
    </span>
  );
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "## My notes" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Feel free to leave notes about this paper using **Markdown**-styled editing.",
      },
    ],
  },
];

export default MarkdownPreviewExample;

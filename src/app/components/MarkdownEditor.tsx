import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Slate, Editable, withReact } from "slate-react";
import { Text, createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { css } from "@emotion/css";

import { updatePaperNotes, selectPaperNotesById } from "../redux/paperSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// Preset text
const presetText: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "## My notes" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Leave your notes about this paper using **Markdown**-styled editing.",
      },
    ],
  },
];

const MarkdownEditor = ({ paperId }) => {
  const dispatch = useAppDispatch();

  // Main editor
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  // Get previous notes if they exist
  const notes: Descendant[] | null = useAppSelector(
    selectPaperNotesById(paperId)
  );
  const initialValue = useMemo(() => {
    return notes || presetText;
  }, [notes, paperId]);

  // Rendering
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
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

  // Blurring, update redux notes
  const onEditorBlur = () => {
    dispatch(
      updatePaperNotes({
        id: paperId,
        notes: editor.children,
      })
    );
  };
  useEffect(() => {
    console.log(paperId);
    console.log(notes);
  }, [notes, paperId]);

  // Modify container height
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, []);

  // We have a wrapper div to get the height of the component and adjust automatically
  return (
    <div className="h-full w-full" ref={containerRef} onBlur={onEditorBlur}>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="outline-none"
          decorate={decorate}
          renderLeaf={renderLeaf}
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

export default MarkdownEditor;

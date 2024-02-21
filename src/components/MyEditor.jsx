import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    // Load from local storage on initial render
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    // Save to local storage whenever editor state changes
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  }, [editorState]);

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleInlineStyle = (inlineStyle) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleBlockType = (blockType) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleSave = () => {
    // Save content to local storage
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  };

  const handleBeforeInput = (char) => {
    if (
      char === "#" &&
      editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getText()
        .trim() === ""
    ) {
      const newState = RichUtils.toggleBlockType(editorState, "header-one");
      handleChange(newState);
      return "handled";
    } else if (
      char === "*" &&
      editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getText()
        .trim() === ""
    ) {
      const newState = RichUtils.toggleInlineStyle(editorState, "BOLD");
      handleChange(newState);
      return "handled";
    } else if (
      char === "^" &&
      editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getText()
        .trim() === ""
    ) {
      const newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
      handleChange(newState);
      return "handled";
    } else if (
      char === "@" &&
      editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getText()
        .trim() === ""
    ) {
      const newState = RichUtils.toggleInlineStyle(editorState, "COLOR-RED");
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div>
      <h2>Text Editor by {"<Aquib />"} </h2>
      <button onClick={() => handleInlineStyle("BOLD")}>Bold</button>
      <button onClick={() => handleInlineStyle("UNDERLINE")}>Underline</button>
      <button onClick={() => handleBlockType("header-one")}>Heading</button>
      <button onClick={() => handleSave()}>Save</button>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={customKeyBinding}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={styleMap}
      />
      <h3>Type '#' for Heading</h3>
      <h3>Type '*' for Bold</h3>
      <h3>Type '^' for Red Line</h3>
      <h3>Type '@' for Underline</h3>
    </div>
  );
};

const customKeyBinding = (e) => {
  if (e.keyCode === 83 && (e.ctrlKey || e.metaKey)) {
    // Ctrl + S
    return "save-editor-content";
  }
  return getDefaultKeyBinding(e);
};

// Define custom style map for red color
const styleMap = {
  "COLOR-RED": {
    color: "red",
  },
};

export default MyEditor;

import React, { useState } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PDFView from "./PDFView";
import { BUTTON_TEXT, NOTE } from "../utils/constants";

const Home = () => {
  const [file, setFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  //converting pdf file to base64 string so that it can be used by <Document> in PDFView component.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file !== null) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setViewFile(e.target.result);
      };
    } else {
      setViewFile(null);
    }
  };

  return (
    <div className="lg:m-16 md:m-12 sm:m-10">
      <form onSubmit={handleSubmit}>
        {/* view pdf button only visible when a pdf is uploaded in the form */}
        {file && (
          <button
            className="bg-gray-200 p-1 rounded-md lg:mr-4 md:mr-4 sm:mr-4"
            type="submit"
          >
            {BUTTON_TEXT.VIEW_PDF}
          </button>
        )}
        <input
          name="foo"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </form>
      {viewFile && (
        <div>
          <span className="text-gray-500">
            {NOTE}
          </span>
          <div>
            {/* passing pdf file and its base64 string */}
            <PDFView viewFile={viewFile} file={file} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

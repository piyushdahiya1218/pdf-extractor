import React, { useState } from "react";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PDFView from "./PDFView";

const Home = () => {
  const [file, setFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  //   const handleFileChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = (e) => {
  //         setFile(e.target.result);
  //       };
  //     } else {
  //       console.log("null pdf file");
  //     }
  //   };
  
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

  //   const newplugin = defaultLayoutPlugin();
  return (
    <div className="lg:m-16 md:m-12 sm:m-10">
      <form onSubmit={handleSubmit}>
        {file && (
          <button className="bg-gray-200 p-1 rounded-md lg:mr-4 md:mr-4 sm:mr-4" type="submit">
            view pdf
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
            Select checkbox for pages that you want to be included in new PDF
            file. Button to download new PDF is at the bottom.
          </span>
          <div>
            <PDFView viewFile={viewFile} file={file} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

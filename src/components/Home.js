import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
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
      }
    } else {
      setViewFile(null);
    }
  };

  //   const newplugin = defaultLayoutPlugin();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="bg-gray-200 p-2 rounded-lg" type="submit">
          view pdf
        </button>
      </form>
      <div>
        <PDFView file={viewFile}/>
      </div>

      {/* <div className="m-10">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js">
          {viewFile && (
            <>
              <Viewer fileUrl={viewFile} plugins={[newplugin]} />
            </>
          )}
          {!viewFile && <>No PDF</>}
        </Worker>
      </div> */}
    </div>
  );
};

export default Home;

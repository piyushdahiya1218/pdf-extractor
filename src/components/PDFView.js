import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

axios.defaults.baseURL = "http://localhost:5000";

const PDFView = (props) => {
  const [numPages, setNumPages] = useState();
  //   const [pageNumber, setPageNumber] = useState(1);
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [newPDF, setNewPDF] = useState();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handleCheckboxChange(pageNumber) {
    const updatedCheckboxStates = [...checkboxStates];
    updatedCheckboxStates[pageNumber] = !checkboxStates[pageNumber];
    setCheckboxStates(updatedCheckboxStates);
    console.log(pageNumber);
  }

  function getState(pageNumber) {
    if (checkboxStates[pageNumber] === null) return false;
    else return checkboxStates[pageNumber];
  }

  const GetNewPDF = async () => {
    const formData = new FormData()
    formData.append("file", props.file)
    try {
      await axios
        .post("/getnewpdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.statusText);
        })
        .catch((err) => {
          console.log(err);
        });

      // setNewPDF(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
      <Document
        file={props.viewFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.log(error.message);
        }}
      >
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((pageNumber) => {
            return (
              <div>
                <input
                  type="checkbox"
                  id={`checkbox-${pageNumber}`}
                  checked={getState(pageNumber)}
                  onChange={() => handleCheckboxChange(pageNumber)}
                />
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            );
          })}
      </Document>
      <button className="bg-gray-200 p-2 rounded-lg mb-32" onClick={GetNewPDF}>
        download new pdf
      </button>
      {newPDF && <span>{newPDF}</span>}
    </div>
  );
};

export default PDFView;

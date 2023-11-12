import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import testpdf from "./testpdf.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

function PDFView(props) {
  const [numPages, setNumPages] = useState();
  //   const [pageNumber, setPageNumber] = useState(1);
  const [checkboxStates, setCheckboxStates] = useState([]);

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

  function getNewPDF() {
    console.log(checkboxStates)
  }

  return (
    <div>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
      <Document
        file={props.file}
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
      <button className="bg-gray-200 p-2 rounded-lg mb-32" onClick={getNewPDF}>
          download new pdf
      </button>
    </div>
  );
}

export default PDFView;

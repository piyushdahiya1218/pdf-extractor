import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import FileSaver from "file-saver";
import { uploadPDF, transformPDF, downloadPDF } from "../apis/events";
import { BUTTON_TEXT, PAGE_NOT_SELECTED_ERROR } from "../utils/constants";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

axios.defaults.baseURL = "http://localhost:5000";

const PDFView = (props) => {
  const [totalPages, setTotalPages] = useState();
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [pagesSelected, setPagesSelected] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  function handleCheckboxChange(pageNumber) {
    const updatedCheckboxStates = [...checkboxStates];
    const obj = {
      pageNumber: pageNumber,
      isChecked: !checkboxStates[pageNumber]?.isChecked,
    };
    updatedCheckboxStates[pageNumber] = obj;
    setCheckboxStates(updatedCheckboxStates);
  }

  function getState(pageNumber) {
    if (checkboxStates[pageNumber] === null) {
      return false;
    } else {
      return checkboxStates[pageNumber]?.isChecked;
    }
  }

  const getNewPDF = async () => {
    checkboxStates.splice(0, 1);
    console.log(checkboxStates);
    console.log(checkboxStates.length);
    if (checkboxStates.length === 0) {
      setPagesSelected(true);
      return;
    }
    setPagesSelected(false);
    const formData = new FormData();
    formData.append("file", props.file);

    const uploadPDFResponse = await uploadPDF(props.file);
    const transformPDFResponse = await transformPDF(
      uploadPDFResponse.data.filename,
      totalPages,
      checkboxStates
    );
    const downloadPDFResponse = await downloadPDF(transformPDFResponse.data);
    FileSaver.saveAs(
      new Blob([downloadPDFResponse.data], { type: "application/pdf" }),
      "result-pdf"
    );
  };

  return (
    <div>
      <Document
        file={props.viewFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.log(error.message);
        }}
      >
        {Array.apply(null, Array(totalPages))
          .map((x, i) => i + 1)
          .map((pageNumber) => {
            return (
              <div>
                <div className="bg-blue-100 p-1 lg:mt-12 md:mt-10 sm:mt-8 w-80">
                  <input
                    type="checkbox"
                    id={`checkbox-${pageNumber}`}
                    checked={getState(pageNumber)}
                    onChange={() => handleCheckboxChange(pageNumber)}
                  />
                  <span className="ml-8">
                    Page {pageNumber}/{totalPages}
                  </span>
                </div>
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            );
          })}
      </Document>
      {pagesSelected && (
        <div className="lg:mt-8 md:mt-6 sm:mt-6">
          <span>{PAGE_NOT_SELECTED_ERROR}</span>
        </div>
      )}
      <button
        className="bg-gray-200 p-2 rounded-lg mb-32 mt-12 "
        onClick={getNewPDF}
      >
        {BUTTON_TEXT.DOWNLOAD_NEW_PDF}
      </button>
    </div>
  );
};

export default PDFView;

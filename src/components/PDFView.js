import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FileSaver from "file-saver";
import {
  uploadPDF,
  transformPDF,
  downloadNewPDF,
} from "../apis/events";
import { BUTTON_TEXT, PAGE_NOT_SELECTED_ERROR, LOADING } from "../utils/constants";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PDFView = (props) => {
  const [totalPages, setTotalPages] = useState(); //total number of pages in pdf file
  const [checkboxStates, setCheckboxStates] = useState([]); //array containing which pages are checked or unchecked
  const [isPageSelected, setIsPageSelected] = useState(true); //bool to check whether atleast 1 page is selected before requesting new pdf download
  const [isDownloadButtonVisible, setIsDownloadButtonVisible] = useState(true); //bool to check if downloadNewPDF button is clicked. When it is clicked this turns true and disables this button to prevent repetetive API calls.

  // when pdf is loaded, extract total number of pages
  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  // refreshing checkboxStates array when a checkbox is checked or unchecked
  function handleCheckboxChange(pageNumber) {
    const updatedCheckboxStates = [...checkboxStates];
    const obj = {
      pageNumber: pageNumber,
      isChecked: !checkboxStates[pageNumber]?.isChecked,
    };
    updatedCheckboxStates[pageNumber] = obj;
    setCheckboxStates(updatedCheckboxStates);
  }

  // check in array if the requested page number is checked or not
  function getState(pageNumber) {
    if (checkboxStates[pageNumber] === null) {
      return false;
    } else {
      return checkboxStates[pageNumber]?.isChecked;
    }
  }

  //checks if atleast 1 page is selected before the user tried to download new pdf
  const isCheckboxStatesValid = () => {
    checkboxStates.splice(0, 1); //remove 0th element as elements in this array follow 1 based indexing
    if (checkboxStates.length === 0) {
      //if length of array is 0 that means no pages are selected
      return false;
    } 
    else {
      var isAnyStateChecked=false;
      checkboxStates.forEach(state => {
        if(state?.isChecked===true){
          isAnyStateChecked=true;
        }
      });
      if(isAnyStateChecked){
        return true
      }
      return false;
    }
  };

  //validation, api calls, new pdf download
  const getNewPDF = async () => {
    if(!isDownloadButtonVisible){
      return;
    }
    if (!isCheckboxStatesValid()) {
      setIsPageSelected(false);
    } else {
      setIsDownloadButtonVisible(false);
      setIsPageSelected(true);
      //api calls to upload, transform, download the new pdf
      const uploadPDFResponse = await uploadPDF(props.file); //response is the name of original file uploaded
      const transformPDFResponse = await transformPDF(  //response is the path of transformed file
        uploadPDFResponse.data.filename,
        totalPages,
        checkboxStates
      );
      const downloadPDFResponse = await downloadNewPDF( //response is the transformed pdf file
        transformPDFResponse.data
      ); 

      //show user the download dialog
      FileSaver.saveAs(
        new Blob([downloadPDFResponse.data], { type: "application/pdf" }),
        "result-pdf"
      );
      //reset checkbox states after new pdf is downloaded
      setCheckboxStates([]);
      setIsDownloadButtonVisible(true);
    }
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
        {/* iterate over each page of the pdf, so that checkbox can be added to each page iteration */}
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
      {/* visible when user tries to download new pdf without selecting any pages */}
      {!isPageSelected && (
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
      {!isDownloadButtonVisible && (
        <span className="ml-4">{LOADING}</span>
      )}
    </div>
  );
};

export default PDFView;

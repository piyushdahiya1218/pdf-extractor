import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import FileSaver from "file-saver";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

axios.defaults.baseURL = "http://localhost:5000";

const PDFView = (props) => {
  const [numPages, setNumPages] = useState();
  //   const [pageNumber, setPageNumber] = useState(1);
  const [checkboxStates, setCheckboxStates] = useState([]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
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

  const pleaseDownloadNewPDF = async (modifiedFilePath) => {
    try {
      const response = await axios.get("/pleasedownloadnewpdf", {
        params: {
          modifiedFilePath: modifiedFilePath,
        },
        responseType: "arraybuffer",
        headers: {
          Accept: "application/pdf",
        },
      });
      FileSaver.saveAs(
        new Blob([response.data], { type: "application/pdf" }),
        "result-pdf"
      );
    } catch (err) {
      console.error(err);
    }
  };

  const downloadNewPDF = async (fileName) => {
    try {
      const response = await axios.get("/downloadnewpdf", {
        params: {
          fileName: fileName,
        },
        // responseType: "arraybuffer",
        // headers: {
        //   Accept: "application/pdf",
        // },
      });
      pleaseDownloadNewPDF(response.data);

      // FileSaver.saveAs(
      //   new Blob([response.data], { type: "application/pdf" }),
      //   "result-pdf"
      // );
    } catch (err) {
      console.error(err);
    }
  };

  const getNewPDF = async () => {
    checkboxStates.splice(0, 1);
    console.log(checkboxStates);

    const formData = new FormData();
    formData.append("file", props.file);
    try {
      await axios
        .post("/getnewpdf", {file: props.file, checkboxStates: checkboxStates}, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          downloadNewPDF(response.data.filename);
        })
        .catch((err) => {
          console.log(err);
        });
      //reset the checkbox values
      setCheckboxStates([]);
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
      <button className="bg-gray-200 p-2 rounded-lg mb-32" onClick={getNewPDF}>
        download new pdf
      </button>
    </div>
  );
};

export default PDFView;

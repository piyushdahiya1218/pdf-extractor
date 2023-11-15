import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import FileSaver from "file-saver";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

axios.defaults.baseURL = "http://localhost:5000";

const PDFView = (props) => {
  const [totalPages, setTotalPages] = useState();
  //   const [pageNumber, setPageNumber] = useState(1);
  const [checkboxStates, setCheckboxStates] = useState([]);
  const [pagesSelected, setPagesSelected] = useState(false)


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
      await axios
        .post(
          "/downloadnewpdf",
          {
            fileName: fileName,
            totalPages: totalPages,
            checkboxStates: checkboxStates,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          pleaseDownloadNewPDF(res.data);
        })
        .catch((err) => {
          console.error(err);
        });

      //   const response = await axios.get("/downloadnewpdf", {
      //     params: {
      //       fileName: fileName,
      //     },
      //     // responseType: "arraybuffer",
      //     // headers: {
      //     //   Accept: "application/pdf",
      //     // },
      //   });
      //   pleaseDownloadNewPDF(response.data);

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
    console.log(checkboxStates.length)
    if(checkboxStates.length===0){
      setPagesSelected(true);
      return;
    }
    setPagesSelected(false)
    const formData = new FormData();
    formData.append("file", props.file);
    try {
      await axios
        .post(
          "/getnewpdf",
          { file: props.file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
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
          <span>select pages before downloading your new pdf</span>
        </div>
      )}
      <button className="bg-gray-200 p-2 rounded-lg mb-32 mt-12 " onClick={getNewPDF}>
        download new pdf
      </button>
    </div>
  );
};

export default PDFView;

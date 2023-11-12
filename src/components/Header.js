import React from "react";

const Header = () => {
  const onSubmit = () => {
    console.log(document.getElementById('includeTextAreaInput').value);
  };

  return (
    <div>
      <div className="grid grid-cols-2">
        <div>
          <span>INCLUDE</span>
          <br />
          <span>enter page numbers to be included seperated with comma</span>
          <br />
          <textarea
            id="includeTextAreaInput"
            placeholder="enter here"
            className="bg-gray-200 w-full h-auto resize:none"
          ></textarea>
        </div>
        <div>
          <span>EXCLUDE</span>
          <br />
          <span>enter page numbers to be excluded seperated with comma</span>
          <br />
          <textarea
            id="excludeTextAreaInput"
            placeholder="enter here"
            className="bg-gray-200 w-full h-auto resize:none"
          ></textarea>
        </div>
      </div>
      <div className="p-2 bg-gray-300 w-32">
        <button onClick={onSubmit}>SUBMIT</button>
      </div>
    </div>
  );
};

export default Header;

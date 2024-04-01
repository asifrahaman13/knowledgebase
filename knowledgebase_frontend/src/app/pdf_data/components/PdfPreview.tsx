import React from "react";

interface PDFViewerProps {
  filePath: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath }) => {
  return (
    <>
      <iframe src={filePath} className="w-full h-full"/>
    </>
  );
};

export default PDFViewer;

import React from "react";

interface PDFViewerProps {
  filePath: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath }) => {
  return (
    <>
      <div className="min-h-screen h-full w-full flex items-center justify-center bg-gray-100">
        <main className="w-full h-full bg-white rounded shadow-md">
          <iframe src={filePath} className="w-full h-full border border-gray-300"></iframe>
        </main>
      </div>
    </>
  );
};

export default PDFViewer;

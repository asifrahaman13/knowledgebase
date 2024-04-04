import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import PdfInterface from "@/domain/interfaces/PdfInterface";
import PdfRepository from "@/infrastructure/repositories/PdfRepository";
import FileService from "@/domain/usecases/FileService";

const pdfRepository = new PdfRepository();
const pdfInterface: PdfInterface = new FileService(pdfRepository);
interface UploadPdfProps {
  counter: number;
}

const UploadPdf: React.FC<UploadPdfProps> = ({ counter }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (counter !== 0) {
      setOpen(true);
    }
  }, [counter]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdf_data, setPdfData] = useState({
    description: "",
    tag: "",
  });

  const cancelButtonRef = useRef(null);

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  function handleDetailsChange(e: any) {
    setPdfData({
      ...pdf_data,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit() {
    const access_token = localStorage.getItem("access_token") || null;
    try {
      if (access_token && selectedFile) {
        const pdfs = await pdfInterface.uploadPdf(access_token, selectedFile, pdf_data.description, pdf_data.tag);
        console.log(pdfs);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className=" font-semibold leading-6 font-sans text-xl text-Pri-Dark">
                      Enter pdf details
                    </Dialog.Title>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="description"
                      id="description"
                      className="block w-full rounded-md border-2 border-Gray-Background py-1.5 text-gray-900  focus:border-blue-800  outline-none   sm:text-sm sm:leading-6 p-2 placeholder:p-2"
                      placeholder="This is one of my favourite pdfs. I like ..."
                      onChange={(e) => {
                        handleDetailsChange(e);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Tag
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="tag"
                      id="tag"
                      className="block w-full rounded-md border-2 border-Gray-Background py-1.5 text-gray-900  ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading placeholder:p-2 p-2 outline-none focus:border-blue-800"
                      placeholder="My new pdf"
                      onChange={(e) => {
                        handleDetailsChange(e);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col w-full gap-4">
                  <div className="mt-4 w-full flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold  text-Normal-Blue focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 hover:text-Normal-Blue"
                    >
                      <span className="">Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>

                    {selectedFile ? (
                      <p className="mt-4 text-sm leading-6 text-gray-600">{selectedFile?.name}</p>
                    ) : (
                      <>
                        {" "}
                        <p className="pl-1">or drag and drop</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-row gap-2  w-full">
                    {" "}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-Pri-Dark text-white px-3 py-2 text-sm font-semibold  shadow-sm ring-1 ring-inset   sm:col-start-1 sm:mt-0"
                      onClick={() => handleSubmit()}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UploadPdf;

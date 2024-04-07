/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import PDFViewer from "../components/PdfPreview";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import PdfInterface from "@/domain/interfaces/PdfInterface";
import PdfRepository from "@/infrastructure/repositories/PdfRepository";
import FileService from "@/domain/usecases/FileService";
import PdfChatRepository from "@/infrastructure/repositories/PdfChatRepository";
import { PdfChatInterface } from "@/domain/interfaces/PdfChatInterface";
import PdfChatService from "@/domain/usecases/pdfChatService";
import { ChatResponses } from "@/domain/entities/Types/pdf_types";

const pdfRepository = new PdfRepository();
const pdfInterface: PdfInterface = new FileService(pdfRepository);

const pdfChatRepository = new PdfChatRepository();
const pdfChatInterface: PdfChatInterface = new PdfChatService(pdfChatRepository);

export default function Page({ params }: { params: { pdf_path: string } }) {
  const [open, setOpen] = useState(false);
  const [presignedPdfUrl, setPresignedPdfUrl] = useState<string>("");
  const [allConversations, setAllConversations] = useState<ChatResponses[]>([]);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    async function fetchPdfData() {
      const access_token = localStorage.getItem("access_token") || null;
      try {
        if (access_token) {
          const pdfs = await pdfInterface.fetchPdfPresignedUrl(access_token, params.pdf_path);
          console.log("The pdf", pdfs);
          if (pdfs?.code === 200) {
            setPresignedPdfUrl(pdfs?.data.url);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPdfData();
  }, [params.pdf_path]);

  const [question, setQuestion] = useState<string>("");

  async function askQuestion() {
    const access_token = localStorage.getItem("access_token") || null;
    const pdfId = params.pdf_path;
    if (access_token) {
      console.log("The result", question);
      const conversationDatas = {
        text: question,
        ai: false, // User's question, not AI's response
      };
      console.log("All conversation", conversationDatas);
      const response = await pdfChatInterface.getChatResponse(access_token, pdfId, question);
      if (response?.code === 200) {
        console.log(response.data);
        if (response.data) {
          const conversationData = {
            text: response.data.message,
            ai: true, // AI's response
          };
          setAllConversations([...allConversations, conversationDatas, conversationData]);
        }
      }
    }
    console.log(allConversations);
  }

  function handleQuestionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    setQuestion(value);
  }

  return (
    <>
      <div className="h-screen w-screen overflow-y-hidden flex flex-col">
        <nav className="bg-white border-gray-200  dark:border-gray-800">
          <div className="flex flex-row items-center  gap-2 p-4">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap  font-sans">knowledgebase.ai - PDF DASHBOARD</span>
            </Link>
            <button
              data-collapse-toggle="navbar-multi-level"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-multi-level"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
            <div className="   ml-auto " id="navbar-multi-level">
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white   dark:border-gray-700">
                <li>
                  <button
                    className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent  md:p-0 md:dark:bg-transparent"
                    aria-current="page"
                    onClick={(e) => {
                      setOpen(true);
                    }}
                  >
                    Upload New
                  </button>
                </li>

                <li>
                  <Link href="/" className="block py-2 px-3   rounded md:bg-transparent  md:p-0  md:dark:bg-transparent" aria-current="page">
                    Home
                  </Link>
                </li>

                <li>
                  <a
                    href="#"
                    className="block py-2 px-3  rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0  md:dark:hover:text-blue-500 dark:hover:bg-gray-700  md:dark:hover:bg-transparent"
                  >
                    Report issues
                  </a>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 :dark:hover:bg-transparent"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700  md:dark:hover:bg-transparent"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="flex flex-grow h-full">
          <div className="grow flex flex-row bg-gray-50 h-full">
            {" "}
            <div className="w-1/2 border-r border-gray-200 h-full  ">
              <PDFViewer filePath={presignedPdfUrl} />
            </div>
            <div className="grow max-w-5xl flex flex-col">
              <div className="h-5/6">
                <div className="flex items-start gap-2.5 w-full flex-col px-12 py-4 h-full overflow-y-scroll no-scrollbar">
                  {allConversations.map((conversation, index) => (
                    <>
                      {conversation.ai === true ? (
                        <>
                          {" "}
                          <div className="flex flex-col lg:w-3/4 max-w-3/4 leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl " key={index}>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-semibold font-sans text-Pri-Dark">AI responses</span>
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                            </div>
                            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-black">{conversation.text}.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          {" "}
                          <div className="flex flex-col ml-auto lg:w-3/4  max-w-3/4 leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl " key={index}>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-semibold font-sans text-Pri-Dark">My questions</span>
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                            </div>
                            <p className="text-sm font-normal py-2.5">{conversation.text}</p>
                          </div>
                        </>
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div className="w-full  grow flex flex-row   p-4 mb-16">
                <textarea
                  id="message"
                  rows={2}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  onChange={(e) => {
                    handleQuestionChange(e);
                  }}
                ></textarea>
                <button
                  onClick={() => {
                    askQuestion();
                  }}
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-white bg-opacity-75 transition-opacity" />
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
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Upload a new pdf
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Upload any pdf from you local system or you can also paste any other url corresponding to the pdf.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => setOpen(false)}
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

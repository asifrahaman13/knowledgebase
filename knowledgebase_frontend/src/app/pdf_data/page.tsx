/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import PdfInterface from "@/domain/interfaces/PdfInterface";
import PdfRepository from "@/infrastructure/repositories/PdfRepository";
import FileService from "@/domain/usecases/FileService";
import { PdfInfo } from "@/domain/entities/Types/pdf_types";
import UploadPdf from "./components/UploadPdf";

const pdfRepository = new PdfRepository();
const pdfInterface: PdfInterface = new FileService(pdfRepository);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [pdfData, setPdfData] = useState<PdfInfo[]>([]);
  const [uploadPdf, setUploadPdf] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    async function fetchPdfData() {
      const access_token = localStorage.getItem("access_token") || null;

      try {
        if (access_token) {
          const pdfs = await pdfInterface.fetchAllPdfs(access_token);
          setPdfData(pdfs?.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPdfData();
  }, []);

  function UploadPdfHandle() {
    setUploadPdf(!uploadPdf);
    setCounter(counter + 1);
  }
  return (
    <>
      <div className="bg-gray-50 h-screen flex flex-col gap-12">
        <header className="text-gray-600 body-font bg-white">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-3 text-xl font-sans font-semibold">Knowledgebase.ai</span>
            </a>
            <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
              <a className="mr-5 hover:text-gray-900">First Link</a>
              <a className="mr-5 hover:text-gray-900">Second Link</a>
              <a className="mr-5 hover:text-gray-900">Third Link</a>
              <a className="mr-5 hover:text-gray-900">Fourth Link</a>
            </nav>
            <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
              Button
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </header>
        <div className="flex justify-center xl:px-4 ">
          <ul role="list" className="divide-y w-full xl:w-5/6 flex flex-col gap-4 divide-gray-100">
            <div className="w-full flex flex-row ">
              <button
                className="ml-auto rounded-lg bg-Pri-Dark text-white px-5 py-2.5"
                onClick={(e) => {
                  e.preventDefault();
                  UploadPdfHandle();
                }}
              >
                Upload New
              </button>
            </div>
            {pdfData.map((project) => (
              <li key={project._id} className="flex items-center justify-between gap-x-6 gap-4 py-5 px-12 rounded-lg bg-white">
                <div className="min-w-0 flex flex-col gap-4">
                  <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{project.pdf_name}</p>
                    {/* <p className={classNames(statuses[project.status as keyof typeof statuses], "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset")}>
                    {project.status}
                  </p> */}
                  </div>
                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p className="bg-purple-50 text-purple-500 rounded-lg px-5 py-2"> {project.tag}</p>

                    <p className="truncate bg-yellow-50 text-yellow-500 rounded-lg px-5 py-2">Created by {project.username}</p>
                  </div>
                  <p className="truncate "> {project.description}</p>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <Link
                    href={`/pdf_data/${project.pdf_name}`}
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                  >
                    View project<span className="sr-only">, {project._id}</span>
                  </Link>
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a href="#" className={classNames(active ? "bg-gray-50" : "", "block px-3 py-1 text-sm leading-6 text-gray-900")}>
                              Edit
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a href="#" className={classNames(active ? "bg-gray-50" : "", "block px-3 py-1 text-sm leading-6 text-gray-900")}>
                              Move
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a href="#" className={classNames(active ? "bg-gray-50" : "", "block px-3 py-1 text-sm leading-6 text-gray-900")}>
                              Delete
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <UploadPdf key={counter} counter={counter}/>
    </>
  );
}

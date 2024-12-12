"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Minimize,
  Search,
  Download,
  Printer,
  Menu,
  Bookmark,
  MessageSquare,
  Sun,
  Moon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  initialScale?: number;
  maxScale?: number;
  minScale?: number;
}

interface Bookmark {
  pageNumber: number;
  text: string;
}

interface Annotation {
  pageNumber: number;
  text: string;
  position: { x: number; y: number };
}

export default function PDFViewer({
  initialScale = 1,
  maxScale = 3,
  minScale = 0.5,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setPdfFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.1, maxScale));
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.1, minScale));
  }

  function rotate() {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  }

  function toggleFullscreen() {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }

  function handleSearch() {
    if (!pdfFile) return;
    console.log("Searching for:", searchText);
    setSearchResults([{ pageNumber: 1, snippet: "..." + searchText + "..." }]);
  }

  function handleDownload() {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfFile);
      link.download = pdfFile.name;
      link.click();
    }
  }

  function handlePrint() {
    if (pdfFile) {
      const pdfUrl = URL.createObjectURL(pdfFile);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();
    }
  }

  function addBookmark() {
    const newBookmark: Bookmark = {
      pageNumber,
      text: `Bookmark on page ${pageNumber}`,
    };
    setBookmarks([...bookmarks, newBookmark]);
  }

  function addAnnotation(text: string) {
    const newAnnotation: Annotation = {
      pageNumber,
      text,
      position: { x: 0, y: 0 }, // This should be improved to get actual mouse position
    };
    setAnnotations([...annotations, newAnnotation]);
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    if (selection) {
      setHighlightedText(selection.toString());
    }
  }

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  const ControlPanel = () => (
    <>
      <div className="flex items-center space-x-2">
        <Button onClick={previousPage} disabled={pageNumber <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </span>
        <Button
          onClick={nextPage}
          disabled={numPages !== null && pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button onClick={rotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
        <Button onClick={addBookmark}>
          <Bookmark className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Annotation</DialogTitle>
              <DialogDescription>
                Enter your annotation for the current page.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter your annotation here"
              onBlur={(e) => addAnnotation(e.target.value)}
            />
          </DialogContent>
        </Dialog>
        <Button onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center space-y-4 w-full max-w-full mx-auto p-4 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      } ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      {!pdfFile && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the PDF file here ...</p>
          ) : (
            <p>Drag 'n' drop a PDF file here, or click to select a file</p>
          )}
        </div>
      )}
      <AnimatePresence mode="wait">
        {pdfFile && (
          <motion.div
            key={pdfFile.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
              <div className="flex justify-between md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Controls</SheetTitle>
                      <SheetDescription>Adjust your PDF view</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <ControlPanel />
                    </div>
                  </SheetContent>
                </Sheet>
                <span className="text-sm">
                  Page {pageNumber || (numPages ? 1 : "--")} of{" "}
                  {numPages || "--"}
                </span>
              </div>
              <div className="hidden md:flex md:justify-between w-full">
                <ControlPanel />
              </div>
            </div>
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Search in PDF"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="mr-2"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mb-4 p-2 bg-gray-100 rounded">
                <h3 className="font-bold">Search Results:</h3>
                {searchResults.map((result, index) => (
                  <div key={index} className="mt-2">
                    <p>
                      Page {result.pageNumber}: {result.snippet}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div
              className={`flex ${
                isLandscape ? "flex-row" : "flex-col md:flex-row"
              }`}
            >
              <div
                className={`${
                  isLandscape ? "w-1/4" : "w-full md:w-1/4"
                } mr-4 overflow-y-auto max-h-[300px] md:max-h-[600px]`}
              >
                <h3 className="font-bold mb-2">Thumbnails</h3>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                  {Array.from(new Array(numPages), (el, index) => (
                    <div
                      key={`thumb-${index}`}
                      className="mb-2 cursor-pointer"
                      onClick={() => setPageNumber(index + 1)}
                    >
                      <Page
                        pageNumber={index + 1}
                        width={100}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </div>
                  ))}
                </Document>
                <h3 className="font-bold mt-4 mb-2">Bookmarks</h3>
                {bookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    className="mb-2 cursor-pointer"
                    onClick={() => setPageNumber(bookmark.pageNumber)}
                  >
                    {bookmark.text}
                  </div>
                ))}
              </div>
              <div className={`${isLandscape ? "w-3/4" : "w-full md:w-3/4"}`}>
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    className="shadow-lg"
                    width={isLandscape ? window.innerWidth * 0.6 : undefined}
                    onMouseUp={handleTextSelection}
                  />
                </Document>
                {annotations
                  .filter((a) => a.pageNumber === pageNumber)
                  .map((annotation, index) => (
                    <div key={index} className="mt-2 p-2 bg-yellow-100 rounded">
                      {annotation.text}
                    </div>
                  ))}
              </div>
            </div>
            {highlightedText && (
              <div className="mt-4 p-2 bg-yellow-200 rounded">
                <h3 className="font-bold">Highlighted Text:</h3>
                <p>{highlightedText}</p>
              </div>
            )}
            <div className="mt-4">
              <Label htmlFor="scale-slider">Zoom</Label>
              <Slider
                id="scale-slider"
                min={minScale * 100}
                max={maxScale * 100}
                step={10}
                value={[scale * 100]}
                onValueChange={(value) => setScale(value[0] / 100)}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="page-input">Go to Page</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="page-input"
                  type="number"
                  min={1}
                  max={numPages || 1}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <Button
                  onClick={() =>
                    setPageNumber(
                      parseInt(
                        (
                          document.getElementById(
                            "page-input"
                          ) as HTMLInputElement
                        ).value
                      ) || 1
                    )
                  }
                >
                  Go
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

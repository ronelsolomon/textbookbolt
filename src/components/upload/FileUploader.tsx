import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { PDFDocument } from '../../types';
import Button from '../common/Button';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';





const FileUploader: React.FC = () => {
  const { addDocument, currentProject, setCurrentStep } = useProject();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File): Promise<PDFDocument> => {
    // Create initial document object
    const document: PDFDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      status: 'uploading',
      progress: 0,
    };

    try {
      // Update status to processing
      document.status = 'processing';
      document.progress = 30;

      // Read the PDF file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Extract text from the first page for preview
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map(item => 'str' in item ? item.str : '');
      
      // Update with extracted content preview
      document.content = textItems.join(' ').substring(0, 200) + '...';
      document.progress = 100;
      document.status = 'ready';
      
      return document;
    } catch (err) {
      document.status = 'error';
      document.error = err instanceof Error ? err.message : 'Unknown error processing PDF';
      throw err;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Filter for PDFs
      const pdfFiles = acceptedFiles.filter(file => 
        file.type === 'application/pdf'
      );
      
      if (pdfFiles.length === 0) {
        setError('Please upload PDF files only.');
        return;
      }
      
      // Process each PDF
      for (const file of pdfFiles) {
        try {
          const document = await processFile(file);
          addDocument(document);
        } catch (err) {
          console.error('Error processing file:', file.name, err);
        }
      }
      
      // Move to the next step if at least one file was processed successfully
      if (currentProject?.documents.length) {
        setCurrentStep('extract');
      }
    } catch (err) {
      console.error('Error in file upload:', err);
      setError('An error occurred while processing your files.');
    } finally {
      setIsProcessing(false);
    }
  }, [addDocument, currentProject, setCurrentStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        } ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-primary-100 rounded-full">
            <Upload size={36} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop your PDFs here' : 'Drag & drop your PDFs here'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              or click to browse from your computer
            </p>
          </div>
          <div className="flex items-center justify-center">
            <FileText size={16} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-400">Accepts PDF files up to 50MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-md flex items-start">
          <AlertCircle size={18} className="text-error-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {isProcessing && (
        <div className="mt-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
          <p className="mt-2 text-sm text-gray-600">Processing your documents...</p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          disabled={!currentProject?.documents.length}
          onClick={() => setCurrentStep('extract')}
          size="lg"
        >
          {currentProject?.documents.length 
            ? 'Continue to Text Extraction' 
            : 'Upload PDFs to Continue'}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
import React from 'react';
import { File, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { PDFDocument } from '../../types';

const DocumentList: React.FC = () => {
  const { currentProject, removeDocument } = useProject();
  
  if (!currentProject || !currentProject.documents.length) {
    return null;
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getStatusIcon = (document: PDFDocument) => {
    switch (document.status) {
      case 'ready':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'error':
        return <XCircle size={16} className="text-error-500" />;
      case 'uploading':
      case 'processing':
        return (
          <div className="h-4 w-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
        );
      default:
        return <AlertCircle size={16} className="text-warning-500" />;
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-gray-200">
          {currentProject.documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 py-3 px-4 text-sm">
              <div className="col-span-5 flex items-center">
                <File size={18} className="text-gray-400 mr-2" />
                <span className="truncate">{doc.name}</span>
              </div>
              <div className="col-span-2 flex items-center">
                {formatBytes(doc.size)}
              </div>
              <div className="col-span-3 flex items-center">
                <span className="mr-2">{getStatusIcon(doc)}</span>
                <span className="capitalize">{doc.status}</span>
                {doc.status === 'error' && (
                  <span className="ml-2 text-xs text-error-500">{doc.error}</span>
                )}
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-gray-500 hover:text-error-500 focus:outline-none"
                  aria-label="Remove document"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
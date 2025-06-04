import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import Navbar from '../components/layout/Navbar';
import ProcessSteps from '../components/layout/ProcessSteps';
import FileUploader from '../components/upload/FileUploader';
import DocumentList from '../components/upload/DocumentList';
import TextExtraction from '../components/extraction/TextExtraction';
import TextbookPreview from '../components/preview/TextbookPreview';

const Dashboard: React.FC = () => {
  const { currentStep, currentProject, createProject } = useProject();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  
  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
      createProject(newProjectTitle.trim());
      setNewProjectTitle('');
      setShowNewProjectModal(false);
    }
  };
  
  const renderStepContent = () => {
    if (!currentProject) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to AI Textbook Generator</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Transform your PDF documents into well-organized, cohesive textbooks with the help of AI.
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Your First Project
            </button>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 'upload':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Documents</h1>
            <FileUploader />
            <DocumentList />
          </div>
        );
      case 'extract':
      case 'analyze':
      case 'generate':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Process Documents</h1>
            <TextExtraction />
          </div>
        );
      case 'preview':
      case 'export':
        return (
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Textbook Preview</h1>
            <TextbookPreview />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onCreateProject={() => setShowNewProjectModal(true)} />
      
      {currentProject && <ProcessSteps />}
      
      <main className="flex-1">
        {renderStepContent()}
      </main>
      
      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowNewProjectModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Create New Project
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Give your textbook project a descriptive name to help you identify it later.
                      </p>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Textbook Title"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateProject}
                  disabled={!newProjectTitle.trim()}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowNewProjectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
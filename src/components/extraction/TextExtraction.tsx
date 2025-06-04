import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import Button from '../common/Button';
import Card from '../common/Card';
import { ChevronRight, BookOpen, Settings, RefreshCw } from 'lucide-react';

const TextExtraction: React.FC = () => {
  const { currentProject, setCurrentStep, generateTextbook, loading } = useProject();
  const [extractionOptions, setExtractionOptions] = useState({
    includeImages: true,
    extractTables: true,
    preserveFormatting: true,
    detectChapters: true,
  });
  
  if (!currentProject) return null;
  
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setExtractionOptions(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Document Processing</h2>
          <Card>
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium">Content Extraction</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Our AI will extract and analyze the content from your uploaded PDFs. 
              Customize the extraction process using the options below.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeImages"
                  name="includeImages"
                  checked={extractionOptions.includeImages}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="includeImages" className="ml-2 text-sm text-gray-700">
                  Extract images from PDFs
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="extractTables"
                  name="extractTables"
                  checked={extractionOptions.extractTables}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="extractTables" className="ml-2 text-sm text-gray-700">
                  Extract and preserve tables
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preserveFormatting"
                  name="preserveFormatting"
                  checked={extractionOptions.preserveFormatting}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="preserveFormatting" className="ml-2 text-sm text-gray-700">
                  Preserve text formatting (bold, italic)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="detectChapters"
                  name="detectChapters"
                  checked={extractionOptions.detectChapters}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="detectChapters" className="ml-2 text-sm text-gray-700">
                  Auto-detect chapters and sections
                </label>
              </div>
            </div>
          </Card>
          
          <div className="mt-6">
            <Card className="bg-gray-50">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 text-secondary-600 mr-2" />
                <h3 className="text-lg font-medium">Advanced Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
                    AI Confidence Threshold: 75%
                  </label>
                  <input
                    type="range"
                    id="confidence"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low Precision</span>
                    <span>High Precision</span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Language
                  </label>
                  <select
                    id="language"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    defaultValue="auto"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Document Preview</h2>
          <div className="border rounded-lg h-[400px] overflow-auto bg-white shadow-sm p-4">
            {currentProject.documents.length > 0 ? (
              <div className="space-y-6">
                {currentProject.documents.map((doc) => (
                  <div key={doc.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium mb-2">{doc.name}</h3>
                    <p className="text-sm text-gray-700 font-serif">
                      {doc.content || 'No preview available'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No documents to preview
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Card className="bg-primary-50 border-primary-100">
              <h3 className="font-medium text-primary-800 mb-2">AI Processing</h3>
              <p className="text-sm text-primary-700 mb-4">
                Our AI will analyze your documents, extract key concepts, and organize content 
                into a cohesive textbook structure. This may take a few minutes depending on 
                the size and number of your documents.
              </p>
              
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => generateTextbook()}
                  className="w-full"
                  size="lg"
                  loading={loading}
                  icon={loading ? undefined : <RefreshCw className="w-4 h-4" />}
                >
                  Generate Textbook
                </Button>
                
                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep('upload')}
                    variant="outline"
                    size="sm"
                  >
                    Back to Upload
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentStep('analyze')}
                    variant="secondary"
                    size="sm"
                    disabled={loading}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    Skip to Analysis
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextExtraction;
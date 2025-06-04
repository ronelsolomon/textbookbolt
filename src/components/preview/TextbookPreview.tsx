import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import Button from '../common/Button';
import { Download, FileText, BookOpen, FileDown, Video, Play } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const TextbookPreview: React.FC = () => {
  const { currentProject, exportTextbook, loading } = useProject();
  const [activeTab, setActiveTab] = useState<'preview' | 'toc' | 'video'>('preview');
  const [activeChapter, setActiveChapter] = useState<string | null>(
    currentProject?.chapters[0]?.id || null
  );
  const [activeSection, setActiveSection] = useState<string | null>(
    currentProject?.chapters[0]?.sections[0]?.id || null
  );
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  if (!currentProject || !currentProject.chapters.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No textbook content generated yet</p>
          <Button onClick={() => window.location.reload()}>Return to Upload</Button>
        </div>
      </div>
    );
  }

  const handleExport = async (format: 'pdf' | 'docx' | 'html' | 'video') => {
    if (format === 'video') {
      setGeneratingVideo(true);
      // Simulate video generation
      setTimeout(() => {
        setVideoUrl('https://example.com/sample-video.mp4');
        setGeneratingVideo(false);
        setActiveTab('video');
      }, 3000);
      return;
    }
    await exportTextbook(format);
  };
  
  const currentChapter = currentProject.chapters.find(c => c.id === activeChapter);
  const currentSection = currentChapter?.sections.find(s => s.id === activeSection);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'toc'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('toc')}
            >
              Table of Contents
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'preview'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'video'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('video')}
            >
              Video
            </button>
          </div>

          <div className="overflow-auto p-3 flex-1">
            {activeTab === 'toc' ? (
              <div className="space-y-2">
                {currentProject.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-3">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeChapter === chapter.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setActiveChapter(chapter.id);
                        setActiveSection(chapter.sections[0]?.id || null);
                      }}
                    >
                      <BookOpen size={16} className="inline mr-2" />
                      {chapter.title}
                    </button>
                    
                    {activeChapter === chapter.id && (
                      <div className="ml-6 mt-2 space-y-1">
                        {chapter.sections.map((section) => (
                          <button
                            key={section.id}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                              activeSection === section.id
                                ? 'bg-primary-100 text-primary-800'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveSection(section.id)}
                          >
                            <FileText size={14} className="inline mr-2" />
                            {section.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : activeTab === 'video' ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h3 className="text-sm font-medium text-primary-900 mb-2">Video Learning</h3>
                  <p className="text-sm text-primary-700">
                    Transform your textbook content into engaging video lessons with AI narration and visual aids.
                  </p>
                </div>
                
                {!videoUrl && !generatingVideo && (
                  <Button
                    onClick={() => handleExport('video')}
                    className="w-full"
                    icon={<Video size={16} />}
                    loading={generatingVideo}
                  >
                    Generate Video Lesson
                  </Button>
                )}
                
                {generatingVideo && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Generating video lesson...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Title</h3>
                  <p className="text-sm text-gray-600">{currentProject.title}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Chapters</h3>
                  <p className="text-sm text-gray-600">{currentProject.chapters.length}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Sections</h3>
                  <p className="text-sm text-gray-600">
                    {currentProject.chapters.reduce(
                      (count, chapter) => count + chapter.sections.length,
                      0
                    )}
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Source Documents</h3>
                  <p className="text-sm text-gray-600">{currentProject.documents.length}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => handleExport('pdf')}
                variant="primary"
                icon={<FileDown size={16} />}
                loading={loading}
              >
                Export as PDF
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleExport('docx')}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  DOCX
                </Button>
                <Button
                  onClick={() => handleExport('html')}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  HTML
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
          {activeTab === 'video' ? (
            <div className="flex-1 p-4">
              {videoUrl ? (
                <div className="space-y-4">
                  <VideoPlayer src={videoUrl} title={currentProject.title} />
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Video Lesson Features</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <Play size={16} className="mr-2 text-primary-600" />
                        AI-powered narration
                      </li>
                      <li className="flex items-center">
                        <BookOpen size={16} className="mr-2 text-primary-600" />
                        Visual summaries and key points
                      </li>
                      <li className="flex items-center">
                        <FileText size={16} className="mr-2 text-primary-600" />
                        Interactive transcripts
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Generate a video lesson to start learning
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentChapter?.title || 'No chapter selected'}
                </h2>
                <p className="text-sm text-gray-500">
                  {currentSection?.title || 'No section selected'}
                </p>
              </div>
              
              <div className="flex-1 overflow-auto p-8 font-serif">
                {currentSection ? (
                  <div className="prose prose-sm max-w-none">
                    <h1 className="text-2xl font-bold mb-6">{currentChapter?.title}</h1>
                    <h2 className="text-xl font-semibold mb-4">{currentSection.title}</h2>
                    
                    {currentSection.content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Select a chapter and section to view content
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Start New Project
        </Button>
        
        <Button
          onClick={() => handleExport('video')}
          icon={<Video size={16} />}
          loading={generatingVideo}
        >
          Generate Video Lesson
        </Button>
      </div>
    </div>
  );
};

export default TextbookPreview;
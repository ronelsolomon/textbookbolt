import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextbookProject, PDFDocument, ProcessingStep } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// --- Configuration --- //
const defaultProjectStyle = {
  fontFamily: 'serif',
  fontSize: 12,
  primaryColor: '#1E3A8A',
  includeImages: true,
  includeHighlights: true,
  chapterNumbering: true,
};

// --- Context Type --- //
interface ProjectContextType {
  projects: TextbookProject[];
  currentProject: TextbookProject | null;
  currentStep: ProcessingStep;
  loading: boolean;
  createProject: (title: string) => void;
  setCurrentProject: (projectId: string | null) => void;
  addDocument: (document: PDFDocument) => void;
  removeDocument: (documentId: string) => void;
  updateDocument: (document: PDFDocument) => void;
  setCurrentStep: (step: ProcessingStep) => void;
  updateProjectTitle: (title: string) => void;
  generateTextbook: () => Promise<void>;
  exportTextbook: (format: 'pdf' | 'docx' | 'html') => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<TextbookProject[]>(() => {
    const saved = localStorage.getItem('textbookProjects');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProject, setCurrentProjectState] = useState<TextbookProject | null>(null);
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('textbookProjects', JSON.stringify(projects));
  }, [projects]);

  // --- Project Management --- //
  const createProject = (title: string) => {
    const newProject: TextbookProject = {
      id: Date.now().toString(),
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      documents: [],
      chapters: [],
      style: defaultProjectStyle,
    };
    setProjects([...projects, newProject]);
    setCurrentProjectState(newProject);
    setCurrentStep('upload');
  };

  const setCurrentProject = (projectId: string | null) => {
    if (!projectId) {
      setCurrentProjectState(null);
      return;
    }
    const project = projects.find(p => p.id === projectId) || null;
    setCurrentProjectState(project);
    setCurrentStep(project?.documents.length ? 'extract' : 'upload');
  };

  const updateProjects = (updatedProject: TextbookProject) => {
    setProjects(projects.map(p =>
      p.id === updatedProject.id ? updatedProject : p
    ));
    setCurrentProjectState(updatedProject);
  };

  const addDocument = (document: PDFDocument) => {
    if (!currentProject) return;
    
    // Simply add the processed document to the project
    const updatedProject = {
      ...currentProject,
      documents: [...currentProject.documents, document],
      updatedAt: Date.now(),
    };
    
    updateProjects(updatedProject);
  };

  const removeDocument = (documentId: string) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      documents: currentProject.documents.filter(d => d.id !== documentId),
      updatedAt: Date.now(),
    };
    updateProjects(updatedProject);
  };

  const updateDocument = (document: PDFDocument) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      documents: currentProject.documents.map(d =>
        d.id === document.id ? document : d
      ),
      updatedAt: Date.now(),
    };
    updateProjects(updatedProject);
  };

  const updateProjectTitle = (title: string) => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      title,
      updatedAt: Date.now(),
    };
    updateProjects(updatedProject);
  };

  // --- AI Textbook Generation --- //
  const generateTextbook = async () => {
    if (!currentProject) return;
    setLoading(true);

    try {
      const pdfTextContent = currentProject.documents.map(doc => doc.content).join('\n\n');

      const llamaPrompt = `
        Generate a detailed textbook outline (with chapters and sections) based on the following content:
        ${pdfTextContent}
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: llamaPrompt,
          stream: false
        })
      });

      if (!response.ok) throw new Error('LLM API error');

      const data = await response.json();
      const aiText = data.response;

      const sampleChapters = [{
        id: 'chapter-1',
        title: 'AI-Generated Chapter',
        sections: [{
          id: 'section-1-1',
          title: 'Generated Content',
          content: aiText
        }]
      }];

      const updatedProject = {
        ...currentProject,
        chapters: sampleChapters,
        updatedAt: Date.now(),
      };

      updateProjects(updatedProject);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating textbook:', error);
      alert('Failed to generate textbook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Export Textbook --- //
  const exportTextbook = async (format: 'pdf' | 'docx' | 'html') => {
    if (!currentProject) return;
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Textbook "${currentProject.title}" has been exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting textbook:', error);
      alert('Failed to export textbook.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        currentStep,
        loading,
        createProject,
        setCurrentProject,
        addDocument,
        removeDocument,
        updateDocument,
        setCurrentStep,
        updateProjectTitle,
        generateTextbook,
        exportTextbook,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextbookProject, PDFDocument, ProcessingStep } from '../types';

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

const defaultProjectStyle = {
  fontFamily: 'serif',
  fontSize: 12,
  primaryColor: '#1E3A8A',
  includeImages: true,
  includeHighlights: true,
  chapterNumbering: true,
};

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

  // Simulate textbook generation with AI
  const generateTextbook = async () => {
    if (!currentProject) return;
    
    setLoading(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample chapters for demo
      const sampleChapters = Array(3).fill(null).map((_, i) => ({
        id: `chapter-${i+1}`,
        title: `Chapter ${i+1}: ${['Introduction', 'Key Concepts', 'Advanced Topics'][i]}`,
        sections: Array(3).fill(null).map((_, j) => ({
          id: `section-${i+1}-${j+1}`,
          title: `Section ${j+1}`,
          content: `This is sample content for section ${j+1} of chapter ${i+1}. In a real implementation, this would be AI-generated content based on the uploaded PDF documents.`
        }))
      }));
      
      const updatedProject = {
        ...currentProject,
        chapters: sampleChapters,
        updatedAt: Date.now(),
      };
      
      updateProjects(updatedProject);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating textbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTextbook = async (format: 'pdf' | 'docx' | 'html') => {
    if (!currentProject) return;
    
    setLoading(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would generate and download the file
      console.log(`Exporting textbook in ${format} format...`);
      
      alert(`Textbook "${currentProject.title}" has been exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting textbook:', error);
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
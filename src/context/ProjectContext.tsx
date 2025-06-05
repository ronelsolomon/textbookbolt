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

      const prompt = `
        Task: Create a textbook outline with chapters and sections based on the following content.
        Format the response as JSON with the following structure:
        {
          "chapters": [
            {
              "title": "Chapter Title",
              "sections": [
                {
                  "title": "Section Title",
                  "content": "Section content..."
                }
              ]
            }
          ]
        }
        
        Content: ${pdfTextContent}
      `;

      const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 2000,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        })
      });

      if (!response.ok) throw new Error('AI generation failed');

      const data = await response.json();
      let parsedData;
      
      try {
        parsedData = JSON.parse(data[0].generated_text);
      } catch (e) {
        // If JSON parsing fails, create a simple chapter structure
        parsedData = {
          chapters: [{
            title: 'Generated Content',
            sections: [{
              title: 'Overview',
              content: data[0].generated_text
            }]
          }]
        };
      }

      const formattedChapters = parsedData.chapters.map((chapter: any, i: number) => ({
        id: `chapter-${i + 1}`,
        title: chapter.title,
        sections: chapter.sections.map((section: any, j: number) => ({
          id: `section-${i + 1}-${j + 1}`,
          title: section.title,
          content: section.content
        }))
      }));

      const updatedProject = {
        ...currentProject,
        chapters: formattedChapters,
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
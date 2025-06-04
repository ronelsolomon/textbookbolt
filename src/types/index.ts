export interface PDFDocument {
  id: string;
  name: string;
  size: number;
  lastModified: number;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
  error?: string;
  content?: string;
  thumbnail?: string;
}

export interface TextbookSection {
  id: string;
  title: string;
  content: string;
}

export interface TextbookChapter {
  id: string;
  title: string;
  sections: TextbookSection[];
}

export interface TextbookProject {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  documents: PDFDocument[];
  chapters: TextbookChapter[];
  style: TextbookStyle;
}

export interface TextbookStyle {
  fontFamily: string;
  fontSize: number;
  primaryColor: string;
  includeImages: boolean;
  includeHighlights: boolean;
  chapterNumbering: boolean;
}

export type ProcessingStep = 
  | 'upload' 
  | 'extract' 
  | 'analyze' 
  | 'generate' 
  | 'preview' 
  | 'export';
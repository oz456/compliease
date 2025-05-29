import { useState, useEffect } from 'react';

// Document type
export interface Document {
  id: string;
  name: string;
  url: string;
  type: string; // File extension (pdf, docx, etc.)
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  category: string;
  fileSize: string;
  userId: string; // Add userId field
}

// Document categories
export const documentCategories = [
  'Business Plan',
  'Financial',
  'Legal',
  'Marketing',
  'Operations',
  'Other'
] as const;

// Dummy data for documents
const dummyDocuments: Document[] = [
  {
    id: '1',
    name: 'Business Plan Template.docx',
    url: 'https://example.com/docs/business-plan.docx',
    type: 'docx',
    size: 123456,
    uploadedAt: '2025-05-20T17:18:19Z',
    uploadedBy: 'Sample User',
    category: 'Business Plan',
    fileSize: '123 KB',
    userId: '1'
  },
  {
    id: '2',
    name: 'Financial Projections.xlsx',
    url: 'https://example.com/docs/financial-projections.xlsx',
    type: 'xlsx',
    size: 456789,
    uploadedAt: '2025-05-20T17:18:19Z',
    uploadedBy: 'Sample User',
    category: 'Financial',
    fileSize: '456 KB',
    userId: '1'
  }
];

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(dummyDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Dummy mutation functions
  const uploadDocument = async (document: Omit<Document, 'id' | 'uploadedAt'>) => {
    setLoading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newDoc = {
        ...document,
        id: Date.now().toString(),
        uploadedAt: new Date().toISOString()
      };
      setDocuments(prev => [...prev, newDoc]);
      return newDoc;
    } catch (err) {
      setError('Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    setLoading(true);
    try {
      // Simulate delete delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      setError('Failed to delete document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return null;
    if (document.url) window.open(document.url, '_blank');
    return document;
  };

  const downloadDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return null;
    if (document.url) window.open(document.url, '_blank');
    return document;
  };

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    viewDocument,
    downloadDocument
  };
}

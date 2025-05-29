import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Upload, FileText, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Static dummy data
const dummyDocuments = [
  {
    id: '1',
    name: 'Business Plan Template.docx',
    type: 'docx',
    category: 'Business Plan',
    size: 123456,
    url: '#',
    uploadedAt: '2025-05-20T17:18:19Z',
    uploadedBy: 'Sample User',
    userId: '1',
    fileSize: '123 KB'
  },
  {
    id: '2',
    name: 'Financial Projections.xlsx',
    type: 'xlsx',
    category: 'Financial',
    size: 456789,
    url: '#',
    uploadedAt: '2025-05-20T17:18:19Z',
    uploadedBy: 'Sample User',
    userId: '1',
    fileSize: '456 KB'
  }
];

const documentCategories = [
  'All Documents',
  'Business Plan',
  'Financial',
  'Legal',
  'Marketing',
  'Operations',
  'Other'
] as const;

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  userId: string;
  fileSize: string;
}

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Documents');
  
  // Filter documents based on search query and active category
  const filteredDocuments = dummyDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All Documents') return matchesSearch;
    return matchesSearch && doc.category === activeCategory;
  });

  // Handle document view
  const handleViewDocument = (documentId: string) => {
    navigate(`/documents/${documentId}`);
  };

  // Handle document download
  const handleDownloadDocument = (documentId: string) => {
    const document = dummyDocuments.find(doc => doc.id === documentId);
    if (document?.url) window.open(document.url, '_blank');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Store and access all your important business documents
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => navigate('/documents/upload')}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </header>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground opacity-25 mb-4" />
              <h3 className="text-lg font-medium mb-1">No documents found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or upload new documents
              </p>
              <Button className="mt-4" onClick={() => navigate('/documents/upload')}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs 
            defaultValue="All Documents" 
            onValueChange={setActiveCategory}
            className="space-y-4"
          >
            <TabsList className="flex flex-wrap">
              {documentCategories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {documentCategories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {filteredDocuments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground opacity-25 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No documents found</h3>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your search or upload new documents
                      </p>
                      <Button className="mt-4" onClick={() => navigate('/documents/upload')}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDocuments.map((doc) => (
                      <Card className="overflow-hidden" key={doc.id}>
                        <div className="bg-muted p-4 flex items-center justify-center border-b h-40">
                          <FileText className="h-16 w-16 text-muted-foreground opacity-50" />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1 truncate" title={doc.name}>
                            {doc.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {doc.fileSize}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">
                            Uploaded on {doc.uploadedAt}
                            {doc.uploadedBy && ` by ${doc.uploadedBy}`}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewDocument(doc.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => handleDownloadDocument(doc.id)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default DocumentsPage;

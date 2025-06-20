# Tutorial 3: Adding File Upload for ZIP Analysis

## Goal
Implement file upload functionality that allows users to upload ZIP files containing their project for AGENTS.md generation, expanding the platform's core functionality.

## What We'll Build
A drag-and-drop file upload interface that:
- Accepts ZIP files only
- Shows upload progress
- Validates file size and type
- Integrates with our GPT for analysis

## Prerequisites
- Understanding of file handling in JavaScript
- Knowledge of drag and drop events
- Familiarity with async operations and promises

## Steps

### 1. Create the File Upload Component

```typescript
// client/src/components/file-upload.tsx
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileAnalyzed?: (result: string) => void;
}

export function FileUpload({ onFileAnalyzed }: FileUploadProps) {
  // State to track the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State to show upload progress (0-100)
  const [uploadProgress, setUploadProgress] = useState(0);
  // State to track if we're currently uploading
  const [isUploading, setIsUploading] = useState(false);
  // State for drag and drop visual feedback
  const [isDragOver, setIsDragOver] = useState(false);
  
  const { toast } = useToast();

  // Function to validate if the file is acceptable
  const validateFile = (file: File): boolean => {
    // Check file type - only accept ZIP files
    const acceptedTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-zip'
    ];
    
    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file containing your project.",
        variant: "destructive",
      });
      return false;
    }

    // Check file size - limit to 50MB
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a ZIP file smaller than 50MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle file selection from input or drag/drop
  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadProgress(0);
    }
  }, []);

  // Handle drag events for drag-and-drop functionality
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // Prevent default behavior (opening file)
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Get the first file from the dropped files
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Simulate file upload and analysis
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90% until we're done
          }
          return prev + 10;
        });
      }, 200);

      // In a real implementation, you would upload the file to your server
      // For now, we'll simulate the process and redirect to the GPT
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear the progress interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Since we can't actually process ZIP files in the browser,
      // we'll redirect to the GPT with instructions
      const gptUrl = "https://chatgpt.com/g/g-6854af9ed1fc81918a30a9bf2e866602-agents-md";
      const message = `I have a project ZIP file named "${selectedFile.name}" that I'd like you to analyze. Please provide instructions on how I can share this file with you to generate an AGENTS.md file.`;
      
      // Open the GPT in a new tab
      window.open(`${gptUrl}?q=${encodeURIComponent(message)}`, '_blank');

      toast({
        title: "File ready for analysis",
        description: "Opening GPT in a new tab with upload instructions.",
      });

      // Reset the component state
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Project ZIP
        </CardTitle>
        <CardDescription>
          Upload a ZIP file containing your project to generate an AGENTS.md file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          // File selection area
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your ZIP file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              ZIP files only, max 50MB
            </p>
          </div>
        ) : (
          // Selected file display
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Processing..." : "Analyze with GPT"}
            </Button>
          </div>
        )}

        {/* Information section */}
        <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              How it works:
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              Upload your project ZIP file and we'll open our custom GPT in a new tab 
              with instructions on how to share your file for AGENTS.md generation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Add to Home Page

```typescript
// Update client/src/pages/home.tsx
import { FileUpload } from "@/components/file-upload";

// Add this section after the repository input
<section className="py-16 bg-background">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Upload Your Project</h2>
      <p className="text-lg text-muted-foreground">
        Have a project ZIP file? Upload it for analysis
      </p>
    </div>
    <FileUpload />
  </div>
</section>
```

## Key Learning Points

### File Handling
- Working with the File API in JavaScript
- Validating file types and sizes
- Reading file properties (name, size, type)

### Drag and Drop
- Handling drag events (dragover, dragleave, drop)
- Preventing default browser behavior
- Visual feedback during drag operations

### Progress Tracking
- Simulating upload progress with intervals
- Updating UI based on progress state
- Managing async operations with proper cleanup

### User Experience
- Providing clear validation messages
- Visual feedback for different states
- Accessible file input with label association

## Advanced Enhancements

### Real File Upload
```typescript
// For actual file upload to a server
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};
```

### Chunked Upload
```typescript
// For large files, implement chunked upload
const uploadInChunks = async (file: File, chunkSize = 1024 * 1024) => {
  const chunks = Math.ceil(file.size / chunkSize);
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    // Upload each chunk
    await uploadChunk(chunk, i, chunks);
  }
};
```

### File Preview
```typescript
// Add preview for ZIP contents
const previewZipContents = async (file: File) => {
  // Use a library like JSZip to read ZIP contents
  const zip = await JSZip.loadAsync(file);
  const fileList = Object.keys(zip.files);
  return fileList;
};
```

## Next Steps

After completing this tutorial:
1. Add file preview functionality
2. Implement actual server-side file handling
3. Add support for multiple file types
4. Move on to [Tutorial 4: Admin Dashboard](../data-management/04-admin-dashboard.md)

## Related Code Concepts

- [Async Operations and Promises](../../CODE_CONCEPTS.md#frontend-concepts-react)
- [Event Handling Patterns](../../CODE_CONCEPTS.md#frontend-concepts-react)
- [File API and Browser APIs](../../CODE_CONCEPTS.md#common-patterns-in-our-codebase)
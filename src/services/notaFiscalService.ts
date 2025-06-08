// src/api/uploadService.ts

interface UploadResponse {
    message: string;
    filename?: string;
    filepath?: string;
}

export const uploadInvoiceFile = async (file: File): Promise<UploadResponse> => {
    if (!file) {
        throw new Error("No file selected for upload.");
    }

    const formData = new FormData();
    formData.append('nota_fiscal', file);

    let response: Response;

    try {
        response = await fetch('http://localhost:8000/nota-fiscal', {
            method: 'POST',
            body: formData,
        });

        let data: UploadResponse | any;

        try {
            data = await response.json();
        } catch (jsonError) {
            if (!response.ok) {
                throw new Error(`Server error (${response.status}): ${response.statusText || 'No valid JSON response.'}`);
            }
            throw new Error('Unexpected server response: Expected JSON, but got something else.');
        }

        if (!response.ok) {
            const errorMessage = data.message || `Server responded with status ${response.status}: ${response.statusText || 'Unknown error'}`;
            throw new Error(errorMessage);
        }

        return data;

    } catch (error) {
        let errorMessage = 'An unknown network or API error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }
        
        console.error('Detailed error in uploadService:', error);
        throw new Error(`Upload failed: ${errorMessage}`);
    }
};
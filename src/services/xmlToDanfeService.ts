export const transformXmlToDanfe = async (file: File): Promise<void> => {
    if (!file) {
        throw new Error("No file selected for transform.");
    }

    const formData = new FormData();
    formData.append('xmlFile', file); // deve bater com o nome do parâmetro no backend

    try {
        const response = await fetch('https://localhost:7214/api/Danfe/gerar', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro do servidor (${response.status}): ${errorText}`);
        }

        // Recebe o PDF como Blob
        const blob = await response.blob();

        // Cria uma URL para o Blob
        const url = window.URL.createObjectURL(blob);

        // Cria um link invisível para forçar o download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'danfe.pdf'; // Nome do arquivo salvo
        document.body.appendChild(a);
        a.click();

        // Libera a memória do blob após o uso
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Erro ao transformar o arquivo:', error);
        const message =
            error instanceof Error
                ? error.message
                : typeof error === 'string'
                ? error
                : 'Erro desconhecido ao fazer upload.';
        throw new Error(`Upload failed: ${message}`);
    }
};

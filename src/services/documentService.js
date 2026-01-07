import api from './api';

// 1. Subir documento (Recibe un objeto FormData)
export const uploadDocument = async (formData) => {
    // Nota: Al pasar FormData, Axios detecta automáticamente
    // que debe usar 'multipart/form-data', no hace falta configurar headers extra.
    const response = await api.post('/documents/upload', formData);
    return response.data;
};

// 2. Obtener mis documentos subidos
export const getMyDocuments = async () => {
    const response = await api.get('/documents/my-documents');
    return response.data;
};
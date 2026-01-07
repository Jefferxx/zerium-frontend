import api from './api';

// 1. Subir documento (Recibe un objeto FormData)
export const uploadDocument = async (formData) => {
    // Nota: Al pasar FormData, Axios detecta automáticamente 'multipart/form-data'
    const response = await api.post('/documents/upload', formData);
    return response.data;
};

// 2. Obtener mis documentos subidos
export const getMyDocuments = async () => {
    const response = await api.get('/documents/my-documents');
    return response.data;
};

// 3. Obtener documentos de un usuario específico (Para el Dueño)
export const getTenantDocuments = async (userId) => {
    const response = await api.get(`/documents/user/${userId}`);
    return response.data;
};

// 4. Actualizar estado (Aprobar/Rechazar)
export const updateDocumentStatus = async (docId, status, reason = null) => {
    // status debe ser: 'verified' o 'rejected'
    const payload = {
        status: status,
        rejection_reason: reason
    };
    const response = await api.patch(`/documents/${docId}/status`, payload);
    return response.data;
};
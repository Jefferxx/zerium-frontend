import api from './api';

// 1. Subir documento
export const uploadDocument = async (formData) => {
    const response = await api.post('/documents/upload', formData);
    return response.data;
};

// 2. Obtener mis documentos
export const getMyDocuments = async () => {
    const response = await api.get('/documents/my-documents');
    return response.data;
};

// 3. Obtener documentos de un usuario (Dueño)
export const getTenantDocuments = async (userId) => {
    const response = await api.get(`/documents/user/${userId}`);
    return response.data;
};

// 4. Actualizar estado (Aprobar/Rechazar)
export const updateDocumentStatus = async (docId, status, reason = null) => {
    const payload = {
        status: status,
        rejection_reason: reason
    };
    const response = await api.patch(`/documents/${docId}/status`, payload);
    return response.data;
};
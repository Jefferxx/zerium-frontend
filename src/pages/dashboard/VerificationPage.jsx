import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UploadCloud, FileText, CheckCircle, XCircle, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { uploadDocument, getMyDocuments } from '../../services/documentService';

export default function VerificationPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Formulario
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Cargar documentos existentes
    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const data = await getMyDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Error cargando documentos:", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setUploading(true);
        try {
            // Preparar el FormData (Necesario para enviar archivos)
            const formData = new FormData();
            formData.append('document_type', data.document_type);
            formData.append('file', data.file[0]); // El input file devuelve un array

            await uploadDocument(formData);

            alert("Documento subido con éxito ✅");
            reset(); // Limpiar formulario
            loadDocuments(); // Recargar lista
        } catch (error) {
            console.error("Error subiendo:", error);
            alert("Error al subir el documento. Revisa que sea PDF o Imagen.");
        } finally {
            setUploading(false);
        }
    };

    // Función auxiliar para iconos de estado
    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            verified: "bg-green-100 text-green-800 border-green-200",
            rejected: "bg-red-100 text-red-800 border-red-200"
        };

        const icons = {
            pending: <Clock className="w-3 h-3 mr-1" />,
            verified: <CheckCircle className="w-3 h-3 mr-1" />,
            rejected: <XCircle className="w-3 h-3 mr-1" />
        };

        return (
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
                {icons[status]} {status === 'verified' ? 'Verificado' : status === 'rejected' ? 'Rechazado' : 'En Revisión'}
            </span>
        );
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Encabezado */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-primary w-8 h-8" /> Verificación de Identidad
                </h1>
                <p className="text-gray-500 mt-1">Sube tus documentos para generar confianza con los propietarios.</p>
            </div>

            {/* FORMULARIO DE SUBIDA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Subir Nuevo Documento</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {/* Tipo de Documento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                        <select
                            {...register("document_type", { required: true })}
                            className="w-full border-gray-300 rounded-lg focus:ring-primary focus:border-primary p-2.5 border"
                        >
                            <option value="cedula">Cédula de Identidad / DNI</option>
                            <option value="antecedentes">Récord Policial (Antecedentes)</option>
                            <option value="rol_pagos">Rol de Pagos / Ingresos</option>
                            <option value="buro_credito">Reporte de Buró de Crédito</option>
                            <option value="otro">Otro Documento</option>
                        </select>
                    </div>

                    {/* Input Archivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Archivo (PDF o Imagen)</label>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            {...register("file", { required: true })}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition"
                        />
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 h-[42px]"
                    >
                        {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
                        {uploading ? "Subiendo..." : "Subir Documento"}
                    </button>
                </form>
            </div>

            {/* LISTA DE DOCUMENTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-gray-600" />
                                </div>
                                {getStatusBadge(doc.status)}
                            </div>
                            <h3 className="font-bold text-gray-900 capitalize mb-1">
                                {doc.document_type.replace('_', ' ')}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Subido el: {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
                            >
                                Ver Archivo ↗
                            </a>
                            {doc.status === 'rejected' && (
                                <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                    <strong>Motivo rechazo:</strong> {doc.rejection_reason}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {documents.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No has subido documentos todavía.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
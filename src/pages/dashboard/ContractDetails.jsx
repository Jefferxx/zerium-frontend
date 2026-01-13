import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Importamos la nueva función finalizeContract
import { getContractById, signContract, finalizeContract } from '../../services/contractService';
import { getTenantDocuments, updateDocumentStatus } from '../../services/documentService';
import { Loader2, FileText, Calendar, DollarSign, User, ShieldCheck, Check, X, ExternalLink, PenTool, AlertTriangle, Lock } from 'lucide-react';

export default function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [tenantDocs, setTenantDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const role = localStorage.getItem('role');
  const isLandlord = role === 'landlord';
  const isTenant = role === 'tenant';

  useEffect(() => {
    loadData();
  }, [id, isLandlord]);

  async function loadData() {
    try {
      const data = await getContractById(id);
      setContract(data);

      // Si hay inquilino asignado, cargamos sus docs
      if (data.tenant_id) {
        const docs = await getTenantDocuments(data.tenant_id);
        setTenantDocs(docs);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = async (docId, newStatus) => {
    if (!window.confirm(`¿Confirmar cambio a ${newStatus}?`)) return;
    try {
      await updateDocumentStatus(docId, newStatus);
      setTenantDocs(docs => docs.map(d => d.id === docId ? { ...d, status: newStatus } : d));
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  // 1. FIRMA DEL INQUILINO
  const handleTenantSign = async () => {
    const hasVerifiedDocs = tenantDocs.some(d => d.status === 'verified');
    if (!hasVerifiedDocs) {
      alert("❌ No puedes firmar todavía.\n\nDebes subir tus documentos y esperar a que el dueño los apruebe (Estado: Verificado).");
      return;
    }

    if (!window.confirm("¿Firmar contrato? Al hacerlo, confirmas tus datos.")) return;

    setActionLoading(true);
    try {
      await signContract(id);
      alert("Firma registrada ✅. Ahora espera la firma del dueño.");
      loadData();
    } catch (error) {
      // Muestra el mensaje de error que viene del backend
      alert(error.response?.data?.detail || "Error al firmar");
    } finally {
      setActionLoading(false);
    }
  };

  // 2. FIRMA DEL DUEÑO (Finalizar)
  const handleLandlordFinalize = async () => {
    if (!window.confirm("¿Contrafirmar y Activar contrato? La unidad pasará a estar ocupada.")) return;

    setActionLoading(true);
    try {
      await finalizeContract(id);
      alert("¡Contrato Activado! 🎉");
      loadData();
    } catch (error) {
      alert("Error al finalizar contrato");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: "Esperando Inquilino", style: "bg-yellow-100 text-yellow-800" },
      signed_by_tenant: { label: "Firma Pendiente (Dueño)", style: "bg-blue-100 text-blue-800" },
      active: { label: "Activo / Vigente", style: "bg-green-100 text-green-800" },
      terminated: { label: "Finalizado", style: "bg-gray-100 text-gray-800" },
      rejected: { label: "Rechazado", style: "bg-red-100 text-red-800" }
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${config.style}`}>
        {config.label}
      </span>
    );
  };

  if (loading) return <Loader2 className="animate-spin text-primary w-8 h-8 mx-auto mt-10" />;
  if (!contract) return <div className="text-center p-10">Contrato no encontrado</div>;

  // Verificamos si el inquilino tiene documentos aprobados
  const hasVerifiedDocs = tenantDocs.some(doc => doc.status === 'verified');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-primary" /> Contrato #{contract.id.slice(0, 8)}
          </h1>
          {getStatusBadge(contract.status)}
        </div>

        {/* ALERTA DE ESTADO - GUÍA PARA EL USUARIO */}
        {contract.status === 'pending' && (
          <div className={`p-4 rounded-lg border flex gap-3 ${hasVerifiedDocs ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="mt-1">
              {hasVerifiedDocs ? <PenTool className="w-5 h-5 text-blue-600" /> : <Lock className="w-5 h-5 text-orange-500" />}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                {hasVerifiedDocs ? "Listo para firmar" : "Verificación Requerida"}
              </h3>
              <p className="text-sm text-gray-600">
                {hasVerifiedDocs
                  ? "Tus documentos han sido aprobados. Ya puedes proceder a la firma."
                  : "El inquilino debe tener sus documentos aprobados antes de poder firmar."}
              </p>
            </div>
          </div>
        )}

        {contract.status === 'signed_by_tenant' && (
          <div className="p-4 rounded-lg border bg-purple-50 border-purple-200 flex gap-3">
            <div className="mt-1"><Check className="w-5 h-5 text-purple-600" /></div>
            <div>
              <h3 className="font-bold text-gray-800">Firma del Inquilino Recibida</h3>
              <p className="text-sm text-gray-600">
                {isLandlord ? "El inquilino ya firmó. Revisa y activa el contrato para finalizar." : "Has firmado correctamente. Espera a que el dueño active el contrato."}
              </p>
            </div>
          </div>
        )}

        {/* Detalles del Contrato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-100">
          <div className="flex gap-3"><User className="text-gray-400" /> <div><p className="text-xs text-gray-500">Inquilino</p><p className="font-medium">{contract.tenant?.email}</p></div></div>
          <div className="flex gap-3"><Calendar className="text-gray-400" /> <div><p className="text-xs text-gray-500">Vigencia</p><p className="font-medium">{new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}</p></div></div>
          <div className="flex gap-3"><DollarSign className="text-gray-400" /> <div><p className="text-xs text-gray-500">Valor</p><p className="font-medium text-green-600">${contract.amount}</p></div></div>
        </div>

        {/* ZONA DE ACCIONES (BOTONES) */}
        <div className="mt-8 flex justify-end">

          {/* BOTÓN INQUILINO: FIRMAR */}
          {isTenant && contract.status === 'pending' && (
            <button
              onClick={handleTenantSign}
              disabled={!hasVerifiedDocs || actionLoading}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg
                        ${hasVerifiedDocs
                  ? 'bg-primary text-white hover:bg-blue-700 hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {actionLoading ? <Loader2 className="animate-spin" /> : hasVerifiedDocs ? <PenTool className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              {hasVerifiedDocs ? "Firmar Contrato" : "Firma Bloqueada (Verificar Docs)"}
            </button>
          )}

          {/* BOTÓN DUEÑO: FINALIZAR */}
          {isLandlord && contract.status === 'signed_by_tenant' && (
            <button
              onClick={handleLandlordFinalize}
              disabled={actionLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg hover:scale-105 transition"
            >
              {actionLoading ? <Loader2 className="animate-spin" /> : <Check className="w-5 h-5" />}
              Aprobar y Activar Contrato
            </button>
          )}
        </div>
      </div>

      {/* SECCIÓN DOCUMENTOS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Documentación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenantDocs.map(doc => (
            <div key={doc.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between bg-gray-50/50">
              <div className="flex justify-between items-start mb-3">
                <span className="font-semibold text-gray-800 capitalize">{doc.document_type}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full border uppercase ${doc.status === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                    doc.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                  {doc.status}
                </span>
              </div>

              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 mb-4">
                <ExternalLink className="w-4 h-4" /> Ver Documento
              </a>

              {/* Controles solo para Dueño */}
              {isLandlord && doc.status === 'pending' && (
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button onClick={() => handleVerify(doc.id, 'verified')} className="bg-white border border-green-200 text-green-700 hover:bg-green-50 py-2 rounded-lg text-sm font-medium">Aprobar</button>
                  <button onClick={() => handleVerify(doc.id, 'rejected')} className="bg-white border border-red-200 text-red-700 hover:bg-red-50 py-2 rounded-lg text-sm font-medium">Rechazar</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {tenantDocs.length === 0 && <p className="text-gray-500 italic">No hay documentos subidos.</p>}
      </div>
    </div>
  );
}
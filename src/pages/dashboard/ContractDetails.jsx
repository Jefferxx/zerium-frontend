import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContractById, signContract } from '../../services/contractService'; // <--- Importar signContract
import { getTenantDocuments, updateDocumentStatus } from '../../services/documentService';
import { Loader2, FileText, Calendar, DollarSign, User, ShieldCheck, Check, X, ExternalLink, PenTool, AlertTriangle } from 'lucide-react';

export default function ContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [tenantDocs, setTenantDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false); // Estado para loading de firma

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

      if (isLandlord && data.tenant_id) {
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
    if (!window.confirm(`¿Estás seguro de marcar este documento como ${newStatus}?`)) return;
    try {
      await updateDocumentStatus(docId, newStatus);
      setTenantDocs(docs => docs.map(d => d.id === docId ? { ...d, status: newStatus } : d));
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  // NUEVA FUNCIÓN: Manejar Firma
  const handleSign = async () => {
    if (!window.confirm("¿Aceptas los términos y condiciones de este contrato? Al firmar, el contrato se activará.")) return;

    setSigning(true);
    try {
      await signContract(id);
      alert("¡Contrato firmado exitosamente! 🎉");
      loadData(); // Recargar para ver el estado actualizado
    } catch (error) {
      console.error(error);
      alert("Error al firmar el contrato.");
    } finally {
      setSigning(false);
    }
  };

  // Función auxiliar para color del badge de estado
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      active: "bg-green-100 text-green-800 border-green-200",
      terminated: "bg-gray-100 text-gray-800 border-gray-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    const labels = {
      pending: "Pendiente de Firma",
      active: "Activo / Vigente",
      terminated: "Finalizado",
      rejected: "Rechazado"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  if (!contract) return <div className="text-center p-10 text-red-500">Contrato no encontrado</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contrato de Arrendamiento</h1>
              <p className="text-gray-500 text-sm">ID: {contract.id}</p>
            </div>
          </div>
          {getStatusBadge(contract.status)}
        </div>

        {/* Alerta si está pendiente */}
        {contract.status === 'pending' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-yellow-700">
                  Este contrato aún no está activo.
                  {isTenant ? " Debes revisarlo y firmarlo para poder realizar pagos." : " El inquilino debe firmarlo para activarse."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Inquilino</p>
              <p className="font-medium">{contract.tenant?.full_name || contract.tenant?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Periodo</p>
              <p className="font-medium">
                {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Canon Mensual</p>
              <p className="font-medium text-green-600 text-lg">${contract.amount}</p>
            </div>
          </div>
        </div>

        {/* ACCIÓN DE FIRMA (Solo Inquilino y si está pendiente) */}
        {isTenant && contract.status === 'pending' && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSign}
              disabled={signing}
              className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 transform active:scale-95"
            >
              {signing ? <Loader2 className="animate-spin w-5 h-5" /> : <PenTool className="w-5 h-5" />}
              {signing ? "Firmando..." : "Firmar y Aceptar Contrato"}
            </button>
          </div>
        )}
      </div>

      {/* SECCIÓN DE VERIFICACIÓN (SOLO DUEÑOS) */}
      {isLandlord && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Documentación de Identidad
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Estos documentos pertenecen a la identidad del usuario. Si rechazas uno, aparecerá rechazado en todas sus solicitudes.
          </p>

          {tenantDocs.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">El inquilino no ha subido documentos de identidad.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tenantDocs.map(doc => (
                <div key={doc.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between bg-gray-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-800 capitalize">
                      {doc.document_type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border uppercase ${doc.status === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                      {doc.status === 'verified' ? 'Verificado' : doc.status === 'rejected' ? 'Rechazado' : 'Revisión'}
                    </span>
                  </div>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline flex items-center gap-1 mb-4"
                  >
                    <ExternalLink className="w-4 h-4" /> Ver Documento Original
                  </a>

                  {doc.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => handleVerify(doc.id, 'verified')}
                        className="bg-white border border-green-200 text-green-700 hover:bg-green-50 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Aprobar
                      </button>
                      <button
                        onClick={() => handleVerify(doc.id, 'rejected')}
                        className="bg-white border border-red-200 text-red-700 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
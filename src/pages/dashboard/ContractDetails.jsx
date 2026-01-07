import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContractById } from '../../services/contractService';
import { getTenantDocuments, updateDocumentStatus } from '../../services/documentService'; // Importamos el servicio
import { Loader2, FileText, Calendar, DollarSign, User, ShieldCheck, Check, X, ExternalLink } from 'lucide-react';

export default function ContractDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [tenantDocs, setTenantDocs] = useState([]); // Estado para docs
  const [loading, setLoading] = useState(true);

  // Obtenemos el rol del localStorage para saber si mostrar los controles
  const role = localStorage.getItem('role');
  const isLandlord = role === 'landlord';

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Cargar Contrato
        const data = await getContractById(id);
        setContract(data);

        // 2. Si es Dueño y hay inquilino, cargar documentos
        if (isLandlord && data.tenant_id) {
          try {
            const docs = await getTenantDocuments(data.tenant_id);
            setTenantDocs(docs);
          } catch (err) {
            console.error("Error cargando documentos del inquilino", err);
          }
        }
      } catch (error) {
        console.error("Error cargando contrato:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isLandlord]);

  // Función para manejar Aprobación/Rechazo
  const handleVerify = async (docId, newStatus) => {
    if (!window.confirm(`¿Estás seguro de marcar este documento como ${newStatus}?`)) return;

    try {
      await updateDocumentStatus(docId, newStatus);
      // Actualizar la lista localmente
      setTenantDocs(docs => docs.map(d =>
        d.id === docId ? { ...d, status: newStatus } : d
      ));
    } catch (error) {
      alert("Error al actualizar estado");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  if (!contract) return <div className="text-center p-10 text-red-500">Contrato no encontrado</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contrato #{contract.id.slice(0, 8)}</h1>
            <span className={`px-2 py-1 text-xs rounded-full ${contract.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {contract.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex items-center gap-3 text-gray-700">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Inquilino</p>
              <p className="font-medium">{contract.tenant?.full_name || contract.tenant?.email || "Sin asignar"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Vigencia</p>
              <p className="font-medium">
                {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Monto Mensual</p>
              <p className="font-medium text-green-600">${contract.amount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE VERIFICACIÓN (SOLO DUEÑOS) */}
      {isLandlord && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Documentos del Inquilino
          </h2>

          {tenantDocs.length === 0 ? (
            <p className="text-gray-500 italic">El inquilino no ha subido documentos aún.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenantDocs.map(doc => (
                <div key={doc.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800 capitalize">
                      {doc.document_type}
                    </span>
                    {/* Badge de Estado */}
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${doc.status === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                        doc.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                      {doc.status}
                    </span>
                  </div>

                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline flex items-center gap-1 mb-4"
                  >
                    <ExternalLink className="w-3 h-3" /> Ver Archivo
                  </a>

                  {/* Botones de Acción */}
                  {doc.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleVerify(doc.id, 'verified')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-sm flex justify-center items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Aprobar
                      </button>
                      <button
                        onClick={() => handleVerify(doc.id, 'rejected')}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-sm flex justify-center items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Rechazar
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
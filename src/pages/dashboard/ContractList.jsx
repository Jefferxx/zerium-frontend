import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyContracts } from '../../services/contractService';
import { FileText, User, Calendar, ArrowRight, Loader2 } from 'lucide-react';

export default function ContractsList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMyContracts();
        setContracts(data);
      } catch (error) {
        console.error("Error cargando contratos", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contratos Activos</h1>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No hay contratos registrados.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="p-3 bg-blue-50 rounded-full text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Contrato #{contract.id.slice(0, 8)}...</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-3 h-3 mr-1" /> 
                    {contract.start_date} - {contract.end_date}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0 w-full md:w-auto items-center text-sm text-gray-600">
                <div className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" /> 
                    Inquilino ID: {contract.tenant_id.slice(0, 8)}...
                </div>
                <div className="font-semibold text-lg text-primary">
                    ${contract.amount} / mes
                </div>
                
                <Link 
                  to={`/dashboard/contracts/${contract.id}`}
                  className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-primary hover:text-white transition flex items-center"
                >
                  Ver Pagos <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
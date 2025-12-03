import React, { useState } from 'react';
import { Company } from '../types';
import { Plus, Search, MapPin, Users, Building2, Trash2, Edit } from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
  onAdd: () => void;
  onSelect: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({ 
  companies, 
  onAdd, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj.includes(searchTerm) ||
    c.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ ou unidade..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nova Empresa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">Nenhuma empresa encontrada.</p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div 
              key={company.id} 
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div 
                onClick={() => onSelect(company)}
                className="p-5 cursor-pointer flex-grow space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">CNPJ: {company.cnpj}</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded-full">
                    <Building2 className="w-5 h-5 text-red-600" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="truncate">{company.unit || 'Sem unidade'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-red-500" />
                    <span>{company.employeeCount} Funcionários</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Atualizado: {new Date(company.lastUpdated).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(company); }}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(confirm('Tem certeza que deseja excluir esta empresa?')) {
                        onDelete(company.id);
                      }
                    }}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

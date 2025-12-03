import React, { useState, useEffect } from 'react';
import { Company, ViewState } from './types';
import { getCompanies, saveCompany, deleteCompany, getCompanyById } from './services/storage';
import { CompanyList } from './components/CompanyList';
import { CompanyForm } from './components/CompanyForm';
import { CompanyDetails } from './components/CompanyDetails';
import { LayoutDashboard, MapPin } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>('LIST');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(undefined);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCompanies(getCompanies());
  };

  const handleAddClick = () => {
    setSelectedCompany(undefined);
    setView('FORM');
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setView('FORM');
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setView('DETAILS');
  };

  const handleSave = (company: Company) => {
    saveCompany(company);
    refreshData();
    // If saving while in Details view (updating), stay in details. Else go to list.
    if (view === 'DETAILS') {
      setSelectedCompany(company); 
    } else {
      setView('LIST');
    }
  };

  const handleDetailsUpdate = (updatedCompany: Company) => {
    saveCompany(updatedCompany);
    refreshData();
    setSelectedCompany(updatedCompany);
  };

  const handleDelete = (id: string) => {
    deleteCompany(id);
    refreshData();
    if (selectedCompany?.id === id) {
      setView('LIST');
      setSelectedCompany(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-red-600 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setView('LIST')}
          >
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Sindirefeições-RJ <span className="text-red-600">Gestão</span>
              </h1>
              <div className="flex items-center mt-1 text-xs text-gray-500 font-medium">
                <MapPin className="w-3 h-3 mr-1 text-red-500" />
                Rua Carlos Chambeland, 256 - Vila Penha - RJ
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 hidden md:block text-right">
             <div>Sistema de Gestão Sindical</div>
             <div className="text-xs text-gray-400">v1.1</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'LIST' && (
          <CompanyList 
            companies={companies}
            onAdd={handleAddClick}
            onSelect={handleViewDetails}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

        {view === 'FORM' && (
          <div className="max-w-4xl mx-auto">
            <CompanyForm 
              initialData={selectedCompany}
              onSave={handleSave}
              onCancel={() => setView(selectedCompany ? 'DETAILS' : 'LIST')}
            />
          </div>
        )}

        {view === 'DETAILS' && selectedCompany && (
          <CompanyDetails 
            company={selectedCompany}
            onBack={() => setView('LIST')}
            onEdit={() => handleEditClick(selectedCompany)}
            onUpdate={handleDetailsUpdate}
          />
        )}

      </main>
    </div>
  );
}
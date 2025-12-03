import React, { useState } from 'react';
import { Company, Observation } from '../types';
import { jsPDF } from 'jspdf';
import { ArrowLeft, Edit, Download, Trash2, Calendar, MessageSquare, HandCoins } from 'lucide-react';

interface CompanyDetailsProps {
  company: Company;
  onBack: () => void;
  onEdit: () => void;
  onUpdate: (updatedCompany: Company) => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onBack, onEdit, onUpdate }) => {
  const [newObs, setNewObs] = useState('');
  const [obsType, setObsType] = useState<Observation['type']>('geral');

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(company.name, 10, 20);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 10, 30);
    doc.text(`CNPJ: ${company.cnpj}`, 10, 35);
    doc.text(`Sindirefeições-RJ Gestão`, 10, 40);

    doc.setTextColor(0, 0, 0);
    let y = 55;

    const addSection = (title: string) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38); // Red 600
      doc.text(title, 10, y);
      doc.setDrawColor(220, 38, 38);
      doc.line(10, y + 2, 200, y + 2);
      y += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
    };

    // General Info
    addSection('Dados Gerais');
    doc.text(`Unidade: ${company.unit || 'N/A'}`, 10, y);
    doc.text(`Endereço: ${company.address || 'N/A'}`, 10, y + 6);
    doc.text(`Funcionários: ${company.employeeCount}`, 10, y + 12);
    y += 25;

    // Contribution
    addSection('Contribuição Sindical');
    const contributionText = company.unionContribution?.active 
      ? `Sim - Valor: R$ ${company.unionContribution.value?.toFixed(2)}`
      : 'Não contribui';
    doc.text(`Contribuição Assistencial: ${contributionText}`, 10, y);
    y += 15;

    // Responsible
    addSection('Responsável');
    doc.text(`Nome: ${company.responsible.name}`, 10, y);
    doc.text(`Telefone: ${company.responsible.phone}`, 10, y + 6);
    doc.text(`Email: ${company.responsible.email}`, 10, y + 12);
    y += 25;

    // Functions
    addSection('Quadro de Funcionários');
    company.functions.forEach((f) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`- ${f.role}: R$ ${f.salary.toFixed(2)}`, 10, y);
      y += 6;
    });
    y += 10;

    // Benefits
    addSection('Benefícios Contratados');
    const b = company.benefits;
    
    const benefitsList: string[] = [];
    if (b.healthPlan) benefitsList.push(`Plano de Saúde (${b.healthPlanOperator || 'Não informado'})`);
    if (b.dentalPlan) benefitsList.push(`Plano Odontológico (${b.dentalPlanOperator || 'Não informado'})`);
    if (b.mealVoucher) benefitsList.push(`Vale Refeição (R$ ${b.mealVoucherValue?.toFixed(2) || '0.00'})`);
    if (b.groceryVoucher) benefitsList.push(`Vale Compras (R$ ${b.groceryVoucherValue?.toFixed(2) || '0.00'})`);
    if (b.shalomHealth) benefitsList.push('Shalom Saúde');
    if (b.shalomClub) benefitsList.push('Clube de Vantagens');
    if (b.socialSupport) benefitsList.push('Amparo Social');

    if (benefitsList.length === 0) doc.text('Nenhum benefício padrão registrado.', 10, y);
    else {
      benefitsList.forEach((benefit) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`- ${benefit}`, 10, y);
        y += 6;
      });
    }
    
    if (company.benefits.others) {
      y += 4;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.text(`Outros: ${company.benefits.others}`, 10, y, { maxWidth: 190 });
    }

    doc.save(`${company.name.replace(/\s+/g, '_')}_Relatorio.pdf`);
  };

  const addObservation = () => {
    if (!newObs.trim()) return;
    const observation: Observation = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content: newObs,
      type: obsType
    };
    const updatedCompany = {
      ...company,
      observations: [observation, ...company.observations]
    };
    onUpdate(updatedCompany);
    setNewObs('');
  };

  const deleteObservation = (obsId: string) => {
    const updatedCompany = {
      ...company,
      observations: company.observations.filter(o => o.id !== obsId)
    };
    onUpdate(updatedCompany);
  };

  const BenefitItem = ({ label, detail }: { label: string, detail?: string }) => (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="text-sm font-semibold text-slate-900 bg-white px-2 py-1 rounded border border-gray-200">
        {detail || 'Ativo'}
      </span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para lista
        </button>
        <div className="flex gap-3">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors bg-white">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
            <Edit className="w-4 h-4" />
            Editar Dados
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Company Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{company.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span className="bg-gray-100 px-3 py-1 rounded-full">CNPJ: {company.cnpj}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Atualizado: {new Date(company.lastUpdated).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">Detalhes</h3>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-gray-500">Unidade</dt><dd className="font-medium">{company.unit || '-'}</dd></div>
                  <div><dt className="text-gray-500">Endereço</dt><dd className="font-medium">{company.address || '-'}</dd></div>
                  <div><dt className="text-gray-500">Funcionários</dt><dd className="font-medium">{company.employeeCount}</dd></div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3">Responsável</h3>
                <dl className="space-y-2 text-sm">
                  <div><dt className="text-gray-500">Nome</dt><dd className="font-medium">{company.responsible.name || '-'}</dd></div>
                  <div><dt className="text-gray-500">Telefone</dt><dd className="font-medium">{company.responsible.phone || '-'}</dd></div>
                  <div><dt className="text-gray-500">Email</dt><dd className="font-medium break-all">{company.responsible.email || '-'}</dd></div>
                </dl>
              </div>
            </div>
            
            {/* Contribution Info in General Card */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HandCoins className="w-4 h-4" /> Contribuição Sindical
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                 <span className="text-sm font-medium text-slate-700">Contribuição Assistencial</span>
                 {company.unionContribution?.active ? (
                    <span className="text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full text-sm border border-green-200">
                      R$ {company.unionContribution.value?.toFixed(2)}
                    </span>
                 ) : (
                    <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                      Não contribui
                    </span>
                 )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quadro de Funções</h3>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Função</th>
                    <th className="p-3 text-right">Salário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {company.functions.map(f => (
                    <tr key={f.id}>
                      <td className="p-3 font-medium">{f.role}</td>
                      <td className="p-3 text-right text-gray-600">R$ {f.salary.toFixed(2)}</td>
                    </tr>
                  ))}
                  {company.functions.length === 0 && (
                    <tr><td colSpan={2} className="p-4 text-center text-gray-400">Nenhum registro.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Benefícios</h3>
            <div className="flex flex-col gap-3">
              {company.benefits.healthPlan && (
                <BenefitItem label="Plano de Saúde" detail={company.benefits.healthPlanOperator} />
              )}
              {company.benefits.dentalPlan && (
                <BenefitItem label="Plano Odontológico" detail={company.benefits.dentalPlanOperator} />
              )}
              {company.benefits.mealVoucher && (
                <BenefitItem label="Vale Refeição" detail={`R$ ${company.benefits.mealVoucherValue?.toFixed(2) || '0.00'}`} />
              )}
              {company.benefits.groceryVoucher && (
                <BenefitItem label="Vale Compras" detail={`R$ ${company.benefits.groceryVoucherValue?.toFixed(2) || '0.00'}`} />
              )}
              {company.benefits.shalomHealth && (
                <BenefitItem label="Shalom Saúde" />
              )}
              {company.benefits.shalomClub && (
                <BenefitItem label="Clube de Vantagens" />
              )}
              {company.benefits.socialSupport && (
                <BenefitItem label="Amparo Social" />
              )}
              
              {!company.benefits.healthPlan && !company.benefits.dentalPlan && 
               !company.benefits.mealVoucher && !company.benefits.groceryVoucher &&
               !company.benefits.shalomHealth && !company.benefits.shalomClub && !company.benefits.socialSupport && (
                 <p className="text-gray-400 italic text-center py-4">Nenhum benefício padrão selecionado.</p>
               )
              }
            </div>
            
            {company.benefits.others && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                <span className="font-bold block mb-1">Outros Benefícios:</span>
                {company.benefits.others}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Observations/History */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full max-h-[800px]">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Histórico & Ocorrências
              </h3>
            </div>
            
            <div className="p-4 space-y-3">
              <textarea
                value={newObs}
                onChange={(e) => setNewObs(e.target.value)}
                placeholder="Digite uma observação, ocorrência ou pendência..."
                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-600 outline-none resize-none h-24"
              />
              <div className="flex gap-2">
                <select 
                  value={obsType} 
                  onChange={(e) => setObsType(e.target.value as any)}
                  className="bg-gray-50 border rounded-lg text-sm px-2 outline-none flex-grow"
                >
                  <option value="geral">Geral</option>
                  <option value="ocorrencia">Ocorrência</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="demanda">Demanda</option>
                  <option value="pendencia">Pendência</option>
                </select>
                <button 
                  onClick={addObservation}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {company.observations.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm">
                  Nenhuma observação registrada.
                </div>
              ) : (
                company.observations.map((obs) => (
                  <div key={obs.id} className="relative group border-l-4 border-l-slate-300 pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block
                        ${obs.type === 'ocorrencia' ? 'bg-red-100 text-red-700' : 
                          obs.type === 'reclamacao' ? 'bg-orange-100 text-orange-700' :
                          obs.type === 'pendencia' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'}`}>
                        {obs.type}
                      </span>
                      <button 
                        onClick={() => deleteObservation(obs.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{obs.content}</p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(obs.date).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
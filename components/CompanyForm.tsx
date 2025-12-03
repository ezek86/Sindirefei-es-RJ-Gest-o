import React, { useState } from 'react';
import { Company, SalaryFunction, CompanyBenefits } from '../types';
import { Save, X, Plus, Trash, User, DollarSign, Building, Briefcase, HandCoins } from 'lucide-react';

interface CompanyFormProps {
  initialData?: Company;
  onSave: (company: Company) => void;
  onCancel: () => void;
}

const emptyCompany: Company = {
  id: '',
  name: '',
  cnpj: '',
  address: '',
  unit: '',
  employeeCount: 0,
  responsible: { name: '', phone: '', email: '' },
  functions: [],
  benefits: {
    healthPlan: false,
    healthPlanOperator: '',
    dentalPlan: false,
    dentalPlanOperator: '',
    mealVoucher: false,
    mealVoucherValue: 0,
    groceryVoucher: false,
    groceryVoucherValue: 0,
    shalomHealth: false,
    shalomClub: false,
    socialSupport: false,
    others: ''
  },
  unionContribution: {
    active: false,
    value: 0
  },
  observations: [],
  lastUpdated: new Date().toISOString()
};

export const CompanyForm: React.FC<CompanyFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Company>(
    initialData 
      ? { 
          ...emptyCompany, 
          ...initialData,
          benefits: { ...emptyCompany.benefits, ...initialData.benefits },
          unionContribution: { ...emptyCompany.unionContribution, ...(initialData.unionContribution || {}) }
        } 
      : { ...emptyCompany, id: crypto.randomUUID() }
  );

  const [newFunction, setNewFunction] = useState<SalaryFunction>({ id: '', role: '', salary: 0 });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      responsible: { ...prev.responsible, [name]: value }
    }));
  };

  const handleBenefitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      benefits: { 
        ...prev.benefits, 
        [name]: type === 'checkbox' ? checked : value 
      }
    }));
  };

  const handleBenefitValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      unionContribution: {
        ...prev.unionContribution,
        [name]: type === 'checkbox' ? checked : (parseFloat(value) || 0)
      }
    }));
  };

  const addFunction = () => {
    if (!newFunction.role) return;
    setFormData(prev => ({
      ...prev,
      functions: [...prev.functions, { ...newFunction, id: crypto.randomUUID() }]
    }));
    setNewFunction({ id: '', role: '', salary: 0 });
  };

  const removeFunction = (id: string) => {
    setFormData(prev => ({
      ...prev,
      functions: prev.functions.filter(f => f.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full p-2 border border-slate-600 rounded focus:ring-2 focus:ring-red-600 outline-none bg-slate-800 text-white placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {initialData ? <EditIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5"/>}
          {initialData ? 'Editar Empresa' : 'Nova Empresa'}
        </h2>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Section 1: General Data */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-red-600" />
            Dados Gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome da Empresa *</label>
              <input required name="name" value={formData.name} onChange={handleGeneralChange} className={inputClass} placeholder="Ex: Metalúrgica ABC" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">CNPJ *</label>
              <input required name="cnpj" value={formData.cnpj} onChange={handleGeneralChange} className={inputClass} placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Endereço Completo</label>
              <input name="address" value={formData.address} onChange={handleGeneralChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Unidade/Filial</label>
              <input name="unit" value={formData.unit} onChange={handleGeneralChange} className={inputClass} placeholder="Ex: Zona Norte" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nº Funcionários</label>
              <input type="number" name="employeeCount" value={formData.employeeCount} onChange={handleGeneralChange} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Section 2: Responsible */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            Responsável
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input name="name" value={formData.responsible.name} onChange={handleResponsibleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input name="phone" value={formData.responsible.phone} onChange={handleResponsibleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" name="email" value={formData.responsible.email} onChange={handleResponsibleChange} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Section 3: Contribution */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-red-600" />
            Contribuição Sindical
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="active" 
                checked={formData.unionContribution?.active} 
                onChange={handleContributionChange} 
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500" 
              />
              <span className="text-sm font-medium text-gray-700">Contribuição Assistencial</span>
            </label>
            
            {formData.unionContribution?.active && (
               <div className="space-y-1 w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase">Valor (R$)</label>
                <input 
                  type="number" 
                  name="value"
                  value={formData.unionContribution?.value || ''} 
                  onChange={handleContributionChange} 
                  className={`w-full md:w-48 ${inputClass}`}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Functions & Salaries */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            Funções e Salários
          </h3>
          
          <div className="flex gap-2 mb-4 items-end bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex-grow space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Função</label>
              <input 
                value={newFunction.role}
                onChange={(e) => setNewFunction({...newFunction, role: e.target.value})}
                className={inputClass}
                placeholder="Ex: Soldador"
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Salário (R$)</label>
              <input 
                type="number"
                value={newFunction.salary || ''}
                onChange={(e) => setNewFunction({...newFunction, salary: parseFloat(e.target.value)})}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <button type="button" onClick={addFunction} className="bg-slate-900 text-white p-2 rounded hover:bg-slate-800 border border-slate-700">
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-slate-900 font-bold">
                <tr>
                  <th className="p-3">Função</th>
                  <th className="p-3">Salário</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {formData.functions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500 italic">Nenhuma função adicionada.</td>
                  </tr>
                ) : (
                  formData.functions.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 text-slate-900 font-medium">
                      <td className="p-3">{f.role}</td>
                      <td className="p-3">R$ {f.salary.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <button type="button" onClick={() => removeFunction(f.id)} className="text-red-500 hover:text-red-700">
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Benefits */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-red-600" />
            Benefícios
          </h3>
          <div className="grid grid-cols-1 gap-4">
            
            {/* Health Plan with Operator */}
            <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <label className="flex items-center gap-2 cursor-pointer min-w-[180px]">
                  <input type="checkbox" name="healthPlan" checked={formData.benefits.healthPlan} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm font-medium">Plano de Saúde</span>
                </label>
                {formData.benefits.healthPlan && (
                  <input 
                    type="text" 
                    name="healthPlanOperator"
                    value={formData.benefits.healthPlanOperator || ''} 
                    onChange={handleBenefitChange}
                    className={`flex-grow p-1.5 text-sm ${inputClass}`}
                    placeholder="Nome da Operadora (ex: Amil, Unimed)"
                  />
                )}
              </div>
            </div>

            {/* Dental Plan with Operator */}
            <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <label className="flex items-center gap-2 cursor-pointer min-w-[180px]">
                  <input type="checkbox" name="dentalPlan" checked={formData.benefits.dentalPlan} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm font-medium">Plano Odontológico</span>
                </label>
                {formData.benefits.dentalPlan && (
                  <input 
                    type="text" 
                    name="dentalPlanOperator"
                    value={formData.benefits.dentalPlanOperator || ''} 
                    onChange={handleBenefitChange}
                    className={`flex-grow p-1.5 text-sm ${inputClass}`}
                    placeholder="Nome da Operadora (ex: OdontoPrev)"
                  />
                )}
              </div>
            </div>

            {/* Meal Voucher with Value */}
            <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <label className="flex items-center gap-2 cursor-pointer min-w-[180px]">
                  <input type="checkbox" name="mealVoucher" checked={formData.benefits.mealVoucher} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm font-medium">Vale-refeição</span>
                </label>
                {formData.benefits.mealVoucher && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Valor R$:</span>
                    <input 
                      type="number" 
                      name="mealVoucherValue"
                      value={formData.benefits.mealVoucherValue || ''} 
                      onChange={handleBenefitValueChange}
                      className={`w-32 p-1.5 text-sm ${inputClass}`}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>
            </div>

             {/* Grocery Voucher with Value */}
             <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <label className="flex items-center gap-2 cursor-pointer min-w-[180px]">
                  <input type="checkbox" name="groceryVoucher" checked={formData.benefits.groceryVoucher} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                  <span className="text-sm font-medium">Vale-compras</span>
                </label>
                {formData.benefits.groceryVoucher && (
                   <div className="flex items-center gap-2">
                   <span className="text-sm text-gray-500">Valor R$:</span>
                   <input 
                     type="number" 
                     name="groceryVoucherValue"
                     value={formData.benefits.groceryVoucherValue || ''} 
                     onChange={handleBenefitValueChange}
                     className={`w-32 p-1.5 text-sm ${inputClass}`}
                     placeholder="0.00"
                   />
                 </div>
                )}
              </div>
            </div>

            {/* Checkboxes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" name="shalomHealth" checked={formData.benefits.shalomHealth} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                <span className="text-sm font-medium">Shalom Saúde</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" name="shalomClub" checked={formData.benefits.shalomClub} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                <span className="text-sm font-medium">Clube de Vantagens</span>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" name="socialSupport" checked={formData.benefits.socialSupport} onChange={handleBenefitChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                <span className="text-sm font-medium">Amparo Social</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Benefícios Adicionais (Outros)</label>
            <textarea 
              name="others" 
              value={formData.benefits.others} 
              onChange={handleBenefitChange} 
              className={`w-full p-2 h-20 resize-none ${inputClass}`}
              placeholder="Descreva outros benefícios..."
            />
          </div>
        </section>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 font-medium flex items-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Empresa
        </button>
      </div>
    </form>
  );
};

// Icons
const EditIcon = ({className}:{className:string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const PlusIcon = ({className}:{className:string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
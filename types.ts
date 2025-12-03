export interface SalaryFunction {
  id: string;
  role: string;
  salary: number;
}

export interface Observation {
  id: string;
  date: string; // ISO string
  content: string;
  type: 'ocorrencia' | 'reclamacao' | 'demanda' | 'pendencia' | 'geral';
}

export interface CompanyBenefits {
  healthPlan: boolean;
  healthPlanOperator?: string; // Name of the operator
  dentalPlan: boolean;
  dentalPlanOperator?: string; // Name of the operator
  mealVoucher: boolean; // Vale Refeição
  mealVoucherValue?: number; // Value in R$
  groceryVoucher: boolean; // Vale Compras
  groceryVoucherValue?: number; // Value in R$
  shalomHealth: boolean;
  shalomClub: boolean;
  socialSupport: boolean; // Amparo Social
  others: string;
}

export interface Responsible {
  name: string;
  phone: string;
  email: string;
}

export interface UnionContribution {
  active: boolean;
  value?: number;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  unit: string;
  employeeCount: number;
  responsible: Responsible;
  functions: SalaryFunction[];
  benefits: CompanyBenefits;
  unionContribution: UnionContribution;
  observations: Observation[];
  lastUpdated: string; // ISO string
}

export type ViewState = 'LIST' | 'FORM' | 'DETAILS';
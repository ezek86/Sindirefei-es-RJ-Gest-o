import { Company } from '../types';

const STORAGE_KEY = 'sindigestao_companies_v1';

export const getCompanies = (): Company[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCompany = (company: Company): void => {
  const companies = getCompanies();
  const index = companies.findIndex((c) => c.id === company.id);
  
  if (index >= 0) {
    companies[index] = { ...company, lastUpdated: new Date().toISOString() };
  } else {
    companies.push({ ...company, lastUpdated: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
};

export const deleteCompany = (id: string): void => {
  const companies = getCompanies();
  const filtered = companies.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getCompanyById = (id: string): Company | undefined => {
  const companies = getCompanies();
  return companies.find((c) => c.id === id);
};

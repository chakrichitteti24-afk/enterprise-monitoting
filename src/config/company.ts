export interface CompanyConfig {
  name: string;
  slug: string;
  url: string;
  displayUrl: string;
  tagline: string;
  poweredBy: string;
  supportEmail?: string;
  copyright: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: 'CipherFlux Labs',
  slug: 'cipherflux-labs',
  url: 'https://cipherflux-labs.vercel.app',
  displayUrl: 'cipherflux-labs.vercel.app',
  tagline: 'Engineering Next-Generation Educational & Enterprise Systems',
  poweredBy: 'Powered by CipherFlux Labs',
  supportEmail: 'contact@cipherflux-labs.vercel.app',
  copyright: '© 2026 CipherFlux Labs. All rights reserved.',
};

export default COMPANY_CONFIG;

export const Colors = {
  green: '#138a3d',
  greenBright: '#1aa54a',
  greenDark: '#0d5c29',
  ink: '#0b1510',
  inkSoft: '#223029',
  red: '#d8232a',
  grey: '#e9e7e4',
  bg: '#f6f8f6',
  card: '#ffffff',
  muted: '#6b7a70',
  line: '#e3e9e3',
  gold: '#f5b301',
};

export type Plan = {
  id: string;
  category: 'Shared' | 'WordPress' | 'Reseller' | 'VPS' | 'Dedicated';
  name: string;
  monthly: number;
  annualFactor: number; // annual price = monthly * factor
  badge?: string;
  features: string[];
  kind: 'hosting' | 'vps' | 'dedicated';
};

export const PLANS: Plan[] = [
  // Shared
  { id: 'shared-personal', category: 'Shared', name: 'Personal Hosting', monthly: 699, annualFactor: 10, features: ['1 Website', '5 GB SSD Storage', 'Unmetered Bandwidth (fair use)', '5 Email Accounts', 'Free SSL Certificate', 'Daily Backups, 1-day retention', 'Free .com on 3-year term', 'WordPress Setup Help'], kind: 'hosting' },
  { id: 'shared-business', category: 'Shared', name: 'Business Hosting', monthly: 1999, annualFactor: 10, badge: 'Most Popular', features: ['5 Websites', '25 GB SSD Storage', 'Unmetered Bandwidth (fair use)', '25 Email Accounts', 'Free SSL Certificate', 'Daily Backups, 3-day retention', 'Free .com on 3-year term', 'Priority Setup', 'Managed DNS Help'], kind: 'hosting' },
  { id: 'shared-pro', category: 'Shared', name: 'Professional Hosting', monthly: 3999, annualFactor: 10, badge: 'Best Value', features: ['10 Websites', '50 GB SSD Storage', 'Unmetered Bandwidth (fair use)', '50 Email Accounts', 'Free SSL Certificate', 'Daily Backups, 5-day retention', 'Free .com on 3-year term', 'Priority Support', 'Fair-use CPU/RAM/IO'], kind: 'hosting' },
  // WordPress
  { id: 'wp-starter', category: 'WordPress', name: 'WP Starter', monthly: 999, annualFactor: 10, features: ['1 WordPress Site', '7 GB SSD Storage', 'Unmetered Bandwidth (fair use)', 'Free SSL Certificate', 'Daily Backups'], kind: 'hosting' },
  { id: 'wp-business', category: 'WordPress', name: 'WP Business', monthly: 1999, annualFactor: 10, badge: 'Most Popular', features: ['3 WordPress Sites', '20 GB SSD Storage', 'Unmetered Bandwidth (fair use)', 'Free SSL Certificate', 'Daily Backups'], kind: 'hosting' },
  { id: 'wp-pro', category: 'WordPress', name: 'WP Pro', monthly: 3999, annualFactor: 10, features: ['10 WordPress Sites', '30 GB SSD Storage', 'Unmetered Bandwidth (fair use)', 'Free SSL Certificate', 'Daily Backups'], kind: 'hosting' },
  // Reseller
  { id: 'reseller-r1', category: 'Reseller', name: 'Reseller R1', monthly: 1499, annualFactor: 10, features: ['25 GB SSD Storage', 'Unmetered Bandwidth (fair use)', 'Private Nameservers', 'Free SSL on all accounts', 'Client Dashboard'], kind: 'hosting' },
  { id: 'reseller-r2', category: 'Reseller', name: 'Reseller R2', monthly: 2999, annualFactor: 10, badge: 'Most Popular', features: ['60 GB SSD Storage', 'Unmetered Bandwidth (fair use)', 'Private Nameservers', 'Free SSL on all accounts', 'Client Dashboard'], kind: 'hosting' },
  { id: 'reseller-r3', category: 'Reseller', name: 'Reseller R3', monthly: 4999, annualFactor: 10, features: ['120 GB SSD Storage', 'Unmetered Bandwidth (fair use)', 'Private Nameservers', 'Free SSL on all accounts', 'Client Dashboard', 'Dedicated IP on Request'], kind: 'hosting' },
  // VPS (Cloud Europe + Premium USA combined)
  { id: 'vps-eu-starter', category: 'VPS', name: 'Cloud VPS Starter (Europe)', monthly: 3499, annualFactor: 11, features: ['4 vCPU', '8 GB RAM', '100 GB SSD', '200 Mbit/s Port', 'Unmetered Transfer', 'Root / SSH Access', 'IPv4 + IPv6'], kind: 'vps' },
  { id: 'vps-eu-business', category: 'VPS', name: 'Cloud VPS Business (Europe)', monthly: 4999, annualFactor: 11, badge: 'Most Popular', features: ['6 vCPU', '12 GB RAM', '200 GB SSD', '300 Mbit/s Port', 'Unmetered Transfer', 'Root / SSH Access', 'IPv4 + IPv6'], kind: 'vps' },
  { id: 'vps-eu-pro', category: 'VPS', name: 'Cloud VPS Pro (Europe)', monthly: 7999, annualFactor: 11, features: ['8 vCPU', '24 GB RAM', '300 GB SSD', '600 Mbit/s Port', 'Unmetered Transfer', 'Root / SSH Access', 'IPv4 + IPv6'], kind: 'vps' },
  { id: 'vps-eu-elite', category: 'VPS', name: 'Cloud VPS Elite (Europe)', monthly: 13999, annualFactor: 11, features: ['12 vCPU', '48 GB RAM', '400 GB SSD', '800 Mbit/s Port', 'Unmetered Transfer', 'Root / SSH Access', 'IPv4 + IPv6'], kind: 'vps' },
  { id: 'vps-us-nano', category: 'VPS', name: 'Premium VPS Nano (USA)', monthly: 2999, annualFactor: 11, features: ['2 vCPU', '4 GB RAM', '40 GB NVMe', '500 Mbit/s Port', 'Anti-DDoS Protection', 'Daily Snapshot Included'], kind: 'vps' },
  { id: 'vps-us-pro', category: 'VPS', name: 'Premium VPS Pro (USA)', monthly: 5999, annualFactor: 11, badge: 'Best Value', features: ['6 vCPU', '12 GB RAM', '100 GB NVMe', '2 Gbit/s Port', 'Anti-DDoS Protection', 'Daily Snapshot Included'], kind: 'vps' },
  // Dedicated (Germany, quote-confirmed on website)
  { id: 'dedi-entry', category: 'Dedicated', name: 'Dedicated Entry (Germany)', monthly: 24999, annualFactor: 10, features: ['4 Cores (typical minimum)', '32 GB RAM', '2 x 480 GB SSD', '1 Gbps Port', '1 IPv4 Address', 'Linux (Windows by licence)', 'Root / SSH Access', 'Exact hardware confirmed by quote'], kind: 'dedicated' },
  { id: 'dedi-business', category: 'Dedicated', name: 'Dedicated Business (Germany)', monthly: 27999, annualFactor: 10, badge: 'Most Popular', features: ['8 Cores', '64 GB RAM', '2 x 960 GB NVMe', '1 Gbps Port', '1 IPv4 Address', 'Linux (Windows by licence)', 'Root / SSH Access', 'Exact hardware confirmed by quote'], kind: 'dedicated' },
  { id: 'dedi-enterprise', category: 'Dedicated', name: 'Dedicated Enterprise (Germany)', monthly: 44999, annualFactor: 10, features: ['16 Cores', '128 GB RAM', '2 x 1.92 TB NVMe', '1 Gbps Port', '1 IPv4 Address', 'Linux (Windows by licence)', 'Root / SSH Access', 'Exact hardware confirmed by quote'], kind: 'dedicated' },
];

export type Tld = { tld: string; price: number; years: number; renew: number; popular?: boolean };

export const TLDS: Tld[] = [
  { tld: '.com', price: 3999, years: 1, renew: 5590, popular: true },
  { tld: '.pk', price: 4699, years: 2, renew: 4699, popular: true },
  { tld: '.com.pk', price: 4699, years: 2, renew: 4699, popular: true },
  { tld: '.net', price: 4999, years: 1, renew: 4999 },
  { tld: '.org', price: 5499, years: 1, renew: 5499 },
  { tld: '.org.pk', price: 4699, years: 2, renew: 4699 },
  { tld: '.net.pk', price: 4699, years: 2, renew: 4699 },
  { tld: '.xyz', price: 1999, years: 1, renew: 5999 },
  { tld: '.app', price: 4999, years: 1, renew: 4999 },
  { tld: '.info', price: 9599, years: 1, renew: 9999 },
  { tld: '.co', price: 10999, years: 1, renew: 10999 },
  { tld: '.online', price: 12599, years: 1, renew: 12599 },
  { tld: '.io', price: 16999, years: 1, renew: 16999 },
  { tld: '.store', price: 18199, years: 1, renew: 18199 },
  { tld: '.tech', price: 22299, years: 1, renew: 22299 },
];

export const COMPANY = {
  brand: 'PK Hosting',
  legal: 'TechAbout (Private) Limited',
  tagline: 'We treat your website as our own.',
  since: 2010,
  address: '231-B Main Boulevard, Commercial Broadway, Phase 8 DHA, Lahore, Pakistan',
  phoneDisplay: '(042) 3569 2952',
  phoneDial: '+924235692952',
  email: 'support@pkhosting.com',
  hours: 'Live chat and phone: Mon to Fri, 9am to 6pm PKT. Email and tickets answered daily.',
  payments: ['JazzCash', 'Easypaisa', 'Debit / Credit Card', 'PayPal', 'Bank Transfer'],
  promo: { code: 'WELCOME10', text: 'Save 10% on Shared and Reseller hosting. New customers only.' },
};

export function rs(n: number): string {
  return 'Rs ' + n.toLocaleString('en-US');
}

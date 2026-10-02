import { useSyncExternalStore } from 'react';
import type { Plan } from './data';

export type CartItem = {
  key: string;
  type: 'plan' | 'domain';
  title: string;
  subtitle: string;
  price: number; // current cycle price in PKR
  cycle: string; // e.g. "/month", "/year", "2 years"
  plan?: Plan;
  domain?: string;
  category?: string;
};

export type Service = {
  id: string;
  name: string;
  detail: string;
  status: 'Active' | 'Processing';
  renews: string;
  price: string;
};

export type Ticket = {
  id: string;
  subject: string;
  department: string;
  status: 'Open' | 'Answered';
  updated: string;
  messages: { from: 'you' | 'support'; text: string; at: string }[];
};

export type Order = {
  id: string;
  items: string[];
  total: number;
  method: string;
  date: string;
};

type State = {
  cart: CartItem[];
  services: Service[];
  tickets: Ticket[];
  orders: Order[];
  promoApplied: boolean;
  toast: string;
  signedIn: boolean;
};

const now = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

let state: State = {
  cart: [],
  services: [
    { id: 'svc-1', name: 'Business Hosting', detail: 'mybusiness.pk', status: 'Active', renews: '14 Mar 2027', price: 'Rs 19,990/year' },
    { id: 'svc-2', name: 'Domain: mybusiness.pk', detail: '.pk, registered 2025', status: 'Active', renews: '14 Mar 2027', price: 'Rs 4,699/2 years' },
    { id: 'svc-3', name: 'Cloud VPS Starter (Europe)', detail: 'Frankfurt node, 4 vCPU', status: 'Active', renews: '2 Nov 2026', price: 'Rs 38,490/year' },
  ],
  tickets: [
    {
      id: 'TCK-1042', subject: 'SSL certificate not renewing automatically', department: 'Technical Support', status: 'Answered', updated: 'Today, 09:41',
      messages: [
        { from: 'you', text: 'Hi, the SSL on mybusiness.pk shows an expiry warning in Chrome. Can you check the auto-renew?', at: 'Today, 09:12' },
        { from: 'support', text: 'Thanks for reporting. We re-issued the certificate and confirmed auto-renew is now enabled. Please allow up to 1 hour for browsers to pick up the new certificate.', at: 'Today, 09:41' },
      ],
    },
    {
      id: 'TCK-1037', subject: 'Invoice for March VPS renewal', department: 'Billing', status: 'Open', updated: 'Yesterday, 16:03',
      messages: [
        { from: 'you', text: 'Please share the paid invoice PDF for my VPS renewal for our accounts department.', at: 'Yesterday, 15:48' },
        { from: 'support', text: 'Of course, the invoice has been attached to your billing email. Let us know if you need it stamped.', at: 'Yesterday, 16:03' },
      ],
    },
  ],
  orders: [],
  promoApplied: false,
  toast: '',
  signedIn: true,
};

const listeners = new Set<() => void>();

function emit(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function showToast(msg: string) {
  emit({ toast: msg });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => emit({ toast: '' }), 2400);
}

export function addPlanToCart(plan: Plan, annual: boolean) {
  const price = annual ? plan.monthly * plan.annualFactor : plan.monthly;
  const item: CartItem = {
    key: `plan-${plan.id}-${annual ? 'a' : 'm'}-${Date.now()}`,
    type: 'plan',
    title: plan.name,
    subtitle: annual ? 'Billed annually' : 'Billed monthly',
    price,
    cycle: annual ? '/year' : '/month',
    plan,
    category: plan.category,
  };
  emit({ cart: [...state.cart, item] });
  showToast(`${plan.name} added to cart`);
}

export function addDomainToCart(domain: string, price: number, years: number) {
  if (state.cart.some((c) => c.domain === domain)) {
    showToast('Domain already in cart');
    return;
  }
  const item: CartItem = {
    key: `dom-${domain}`,
    type: 'domain',
    title: domain,
    subtitle: `Domain registration, ${years} year${years > 1 ? 's' : ''}`,
    price,
    cycle: years > 1 ? `/${years} years` : '/year',
    domain,
  };
  emit({ cart: [...state.cart, item] });
  showToast(`${domain} added to cart`);
}

export function removeFromCart(key: string) {
  emit({ cart: state.cart.filter((c) => c.key !== key) });
}

export function setPromo(applied: boolean) {
  emit({ promoApplied: applied });
}

export function clearCart() {
  emit({ cart: [], promoApplied: false });
}

export function addTicket(subject: string, department: string, message: string) {
  const t: Ticket = {
    id: `TCK-${1043 + state.tickets.length}`,
    subject,
    department,
    status: 'Open',
    updated: 'Just now',
    messages: [{ from: 'you', text: message, at: 'Just now' }],
  };
  emit({ tickets: [t, ...state.tickets] });
  return t;
}

export function replyToTicket(id: string, text: string) {
  const tickets = state.tickets.map((t) =>
    t.id === id
      ? { ...t, status: 'Open' as const, updated: 'Just now', messages: [...t.messages, { from: 'you' as const, text, at: 'Just now' }] }
      : t
  );
  emit({ tickets });
}

export function placeOrder(method: string): Order {
  const subtotal = state.cart.reduce((s, c) => s + c.price, 0);
  const discount = state.promoApplied
    ? state.cart.filter((c) => c.category === 'Shared' || c.category === 'Reseller').reduce((s, c) => s + c.price * 0.1, 0)
    : 0;
  const order: Order = {
    id: `PKH-${20261000 + state.orders.length + 1}`,
    items: state.cart.map((c) => c.title),
    total: Math.round(subtotal - discount),
    method,
    date: now(),
  };
  const newServices: Service[] = state.cart.map((c, i) => ({
    id: `svc-new-${Date.now()}-${i}`,
    name: c.title,
    detail: c.type === 'domain' ? c.domain! : 'New service, provisioning',
    status: 'Processing',
    renews: 'Auto after provisioning',
    price: `Rs ${c.price.toLocaleString('en-US')}${c.cycle}`,
  }));
  emit({ orders: [order, ...state.orders], services: [...newServices, ...state.services] });
  clearCart();
  return order;
}

export function cartTotals() {
  const subtotal = state.cart.reduce((s, c) => s + c.price, 0);
  const discount = state.promoApplied
    ? Math.round(state.cart.filter((c) => c.category === 'Shared' || c.category === 'Reseller').reduce((s, c) => s + c.price * 0.1, 0))
    : 0;
  return { subtotal, discount, total: subtotal - discount };
}

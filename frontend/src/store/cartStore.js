import { create } from 'zustand';
export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (p) => set(s => {
    const ex = s.items.find(i => i.product.id === p.id);
    return ex ? { items: s.items.map(i => i.product.id === p.id ? {...i, quantity: i.quantity+1} : i) } : { items: [...s.items, { product: p, quantity: 1 }] };
  }),
  removeItem: (id) => set(s => ({ items: s.items.filter(i => i.product.id !== id) })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => get().items.reduce((t, i) => t + i.product.price * i.quantity, 0),
}));

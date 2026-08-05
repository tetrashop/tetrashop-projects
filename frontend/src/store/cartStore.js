import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product) => set((state) => {
    const existing = state.items.find(i => i.product.id === product.id);
    if (existing) {
      return { items: state.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { product, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.product.id !== id) })),
  updateQuantity: (id, qty) => set((state) => ({ items: state.items.map(i => i.product.id === id ? { ...i, quantity: qty } : i) })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));

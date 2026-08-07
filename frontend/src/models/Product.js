import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, default: 'general' },
  stock: { type: Number, default: 0 },
  description: { type: String },
  digital: { type: Boolean, default: false },
  demoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

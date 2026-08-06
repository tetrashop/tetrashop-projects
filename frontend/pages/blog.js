import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../src/components/Layout';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(setPosts).catch(() => {});
  }, []);
  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', color: '#059669' }}>📰 وبلاگ</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 30 }}>
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{post.title}</h2>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: 8 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, fontSize: '0.8rem', color: '#9ca3af' }}>
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

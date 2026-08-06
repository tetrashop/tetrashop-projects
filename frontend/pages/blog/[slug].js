import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../src/components/Layout';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/${slug}`).then(r => r.json()).then(setPost).catch(() => {});
    }
  }, [slug]);

  if (!post) return <Layout><div style={{ textAlign: 'center', padding: 60 }}>در حال بارگذاری...</div></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
        <h1 style={{ color: '#059669' }}>{post.title}</h1>
        <p style={{ color: '#6b7280' }}>{post.date} - {post.author}</p>
        <div style={{ marginTop: 20, lineHeight: '1.8' }}>{post.content}</div>
      </div>
    </Layout>
  );
}

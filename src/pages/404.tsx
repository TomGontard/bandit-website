// src/pages/404.tsx
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Custom404() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>404 – Page not found</h1>
        <p>Oups, cette page n’existe pas.</p>
        <Link href="/">
          <a style={{ color: '#fff', textDecoration: 'underline' }}>Retour à l’accueil</a>
        </Link>
      </div>
    </Layout>
  )
}

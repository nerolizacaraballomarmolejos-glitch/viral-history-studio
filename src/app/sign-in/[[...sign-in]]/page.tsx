export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-bold text-neon mb-2">Iniciar sesion</h1>
        <p className="text-sm text-muted">Configura Clerk en .env.local para activar login.</p>
      </div>
    </div>
  );
}

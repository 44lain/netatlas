import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const authError =
    params.error === "auth" ? "Link inválido ou expirado. Tente novamente." : undefined;

  return <LoginForm redirectTo={params.redirect} authError={authError} />;
}

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "../../lib/auth";
import { Logo } from "../../components/logo";
import { LoginForm } from "../../components/auth/login-form";

export const instant = false;

export default async function LoginPage() {
  await connection();
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[40%] max-w-[500px] shrink-0 flex-col items-center justify-center gap-6 bg-fjord p-10 lg:flex">
        <Logo variant="dark" height={56} />
        <p className="text-lg font-medium text-white/85">Технологии без хаоса</p>
      </div>
      <div className="flex w-full flex-1 items-center justify-center bg-snow p-4">
        <div className="w-full max-w-sm rounded-lg border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-graphite">Вход</h1>
            <p className="text-sm text-graphite/70">Войдите, чтобы продолжить работу</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

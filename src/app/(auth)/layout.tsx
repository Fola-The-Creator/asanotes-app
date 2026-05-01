import { AuthAnimatedShell } from "@/components/auth/AuthAnimatedShell";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthAnimatedShell>{children}</AuthAnimatedShell>;
}

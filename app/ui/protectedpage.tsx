import { auth } from "@/auth";
import { hasAccess } from "@/app/lib/config/permission";
import Unauthorized from "@/app/ui/unauthroized";

interface ProtectedPageProps {
  children: React.ReactNode;
  path: string;
}

export default async function ProtectedPage({ children, path }: ProtectedPageProps) {
  const session = await auth();
  const user = session?.user;

  if (!user || !hasAccess(user.role, path)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}
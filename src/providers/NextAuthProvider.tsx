"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";

function SessionManager({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "AccessTokenExpired") {
      signOut({ callbackUrl: "/auth/signin" });
    }
  }, [session]);

  return <>{children}</>;
}

export default function SessionProviderWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <SessionManager>{children}</SessionManager>
    </SessionProvider>
  );
}

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Custom404() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/");
    router.push(!session.user.courses?.length ? "/my-courses" : "/questions");
  }, []);

  return null;
}

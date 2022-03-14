import { useSession } from "next-auth/react";
export default function Profile() {
  const data = useSession();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

Profile.isProtected = true;

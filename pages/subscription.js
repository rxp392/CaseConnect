import { useSession } from "next-auth/react";

export default function Subscription() {
  const { data: session } = useSession();

  return <div>{session.user.subscription} Plan</div>;
}

Subscription.auth = true;

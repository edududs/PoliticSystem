import { getServerUser } from "@/lib/server-auth";
import {
  HomeAuthenticated,
  HomeUnauthenticated,
} from "@/components/features/home";

export default async function Home() {
  const user = await getServerUser();

  if (user) {
    return <HomeAuthenticated user={user} />;
  }

  return <HomeUnauthenticated />;
}

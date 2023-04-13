import { NextPage } from "next"
import { useSession } from "./auth-context"
import { LoginForm } from "./login"

export const RequireAuth = (component: NextPage) => {
  const auth = useSession()
  
  if (!auth) {
    return LoginForm
  }

  return component;
}
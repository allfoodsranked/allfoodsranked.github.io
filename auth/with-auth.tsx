import { NextPage } from "next"
import { useSession } from "./auth-context"
import { LoginForm } from "./login"

export const RequireAuth = ({ children }: { children: JSX.Element }): JSX.Element => {
  const auth = useSession()
  
  if (!auth) {
    return <LoginForm />
  }

  return children;
}
import { NextPage } from "next"
import { useSession } from "./auth-context"
import { LoginForm } from "./login"

// Because we're using client side auth only for GH Pages, check if user can see certain pages
export const RequireAuth = ({ children }: { children: JSX.Element }): JSX.Element => {
  const auth = useSession()
  
  if (!auth) {
    return <LoginForm />
  }

  return children;
}
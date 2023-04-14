import type { NextPage } from 'next';
import { LoginForm } from '../auth/login';

const Login: NextPage = () => {
  return (
    <div>
      <h1 className="text-2xl p-4">Recipe Gen</h1>
      <LoginForm />
    </div>
  );
};

export default Login;

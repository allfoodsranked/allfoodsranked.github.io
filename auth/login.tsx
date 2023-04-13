import { FormEvent, FormEventHandler } from 'react';
import { supabase } from '../db/client';

export const LoginForm = () => {
  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const email = e.currentTarget.email?.value;
      if (!email) {
        alert('Please enter an email');
      }
      const resp = await supabase.auth.signInWithOtp({
        email,
      });
      if (resp.error) {
        alert(resp.error.message);
      } else {
        alert('Check your email to login');
      }
    } catch (e) {
      alert('There was an error: ' + e);
    }
  };
  return (
    <form
      className="p-4 flex justify-center flex-col w-1/2 mx-auto"
      onSubmit={signIn}
    >
      <h4 className="text-2xl mb-2 mx-auto">Login</h4>
      <input
        className="p-4"
        type="email"
        name="email"
        placeholder="Your email"
      />
      <button>Send me a magic link!</button>
    </form>
  );
};

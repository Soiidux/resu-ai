import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
export function meta() {
  return [
    { title: "ResuAI | Auth" },
    { name: 'description', content: 'Log into your account' }
  ];
}

export default function Auth() {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();
  useEffect(() => {
    if(auth.isAuthenticated) {
      navigate(next || '/');
    }
  }, [auth.isAuthenticated,next]);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <h1>Welcome</h1>
          <h2>Log in to continue</h2>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
                <>
                  {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>Log Out</button>
                  ) : (
                    <button className="auth-button" onClick={auth.signIn}>Log In</button>
                  )}
                </>
            )}
          </div>
        </section>
      </div>
      
    </main>
  );
}
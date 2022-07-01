import { signIn } from "next-auth/react";

export const LoginComponent = ({
    session
}) => {
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

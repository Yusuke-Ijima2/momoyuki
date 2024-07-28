"use client";

import { signIn, signOut } from "next-auth/react";

const Auth = () => {
  return (
    <>
      <button onClick={() => signIn()}>ログイン</button>
      <button onClick={() => signOut()}>ログアウト</button>
    </>
  );
};

export default Auth;

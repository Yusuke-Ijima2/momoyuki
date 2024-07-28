"use client";

import { signIn, signOut } from "next-auth/react";

const Auth = () => {
  return (
    <div className="space-x-2">
      <button className="p-2 border" onClick={() => signIn()}>
        ログイン
      </button>
      <button className="p-2 border" onClick={() => signOut()}>
        ログアウト
      </button>
    </div>
  );
};

export default Auth;

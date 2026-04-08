"use client";

import { useRouter } from "next/navigation";
import type React from "react";

type StartChatButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  chatHref?: string;
  loginHref?: string;
};

export default function StartChatButton({
  chatHref = "/chat",
  loginHref = "/login",
  onClick,
  ...props
}: StartChatButtonProps) {
  const router = useRouter();

  return (
    <button
      {...props}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        const token = localStorage.getItem("token");
        router.push(token ? chatHref : loginHref);
      }}
    />
  );
}


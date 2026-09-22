import * as React from 'react'
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {

  const logout = async () => {
    localStorage.removeItem('token')
    window.location.reload()
  };

  return <Button onClick={logout} className="flex flex-row items-center gap-2" ><LogOut /> log out</Button>;
}

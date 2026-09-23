import * as React from 'react'
import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from '../context/authContext';

export function LogoutButton() {
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
    window.location.reload()
  };

  return <Button onClick={handleLogout} className="flex flex-row items-center gap-2" ><LogOut /> log out</Button>;
}

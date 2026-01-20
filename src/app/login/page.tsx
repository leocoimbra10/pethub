'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PawPrint } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <Card className="w-full max-w-sm bg-secondary">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="p-4 bg-primary rounded-lg border-2 border-black">
              <PawPrint className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline">Acesse sua conta</CardTitle>
          <CardDescription className="font-bold text-black">
            Bem-vindo de volta! Entre para gerenciar suas reservas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required className="bg-card"/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="font-bold">Senha</Label>
            <Input id="password" type="password" required className="bg-card"/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Entrar</Button>
          <div className="text-center text-sm font-bold">
            Não tem uma conta?{' '}
            <Link href="#" className="underline hover:text-primary">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

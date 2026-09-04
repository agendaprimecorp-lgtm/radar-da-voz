import type { Meta } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useState } from "react";

const meta = {
  title: "Pages/Login",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎤</h1>
          <h1 className="text-3xl font-bold">Radar da Voz</h1>
          <p className="text-gray-400 mt-2">Plataforma de talentos vocais</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle>Bem-vindo</CardTitle>
            <CardDescription>
              Faça login para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  Lembrar-me
                </label>
                <a href="#" className="text-primary-500 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">Ou</span>
              </div>
            </div>

            <Button variant="outline" className="w-full mb-2">
              <span className="mr-2">🔵</span>
              Google
            </Button>

            <Button variant="outline" className="w-full">
              <span className="mr-2">🐱</span>
              GitHub
            </Button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Não tem conta?{" "}
              <a href="#" className="text-primary-500 hover:underline font-semibold">
                Crie uma agora
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="text-primary-500 hover:underline">
            Termos
          </a>
          {" "}e{" "}
          <a href="#" className="text-primary-500 hover:underline">
            Privacidade
          </a>
        </p>
      </div>
    </div>
  );
};

export const SignupPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar Conta</h1>
          <p className="text-gray-400">Passo {step} de 3</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tipo de Usuário
                  </label>
                  <div className="space-y-2">
                    <div className="border-2 border-primary-500 rounded-lg p-4 cursor-pointer bg-primary-500/10">
                      <p className="font-semibold">🎤 Talento</p>
                      <p className="text-sm text-gray-400">
                        Seja uma voz profissional
                      </p>
                    </div>
                    <div className="border-2 border-dark-600 rounded-lg p-4 cursor-pointer hover:border-dark-500">
                      <p className="font-semibold">🎯 Cliente</p>
                      <p className="text-sm text-gray-400">
                        Contrate talentos vocais
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setStep(2)}>
                  Próximo
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nome Completo
                  </label>
                  <Input placeholder="João Silva" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <Input type="email" placeholder="seu@email.com" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button className="w-full" onClick={() => setStep(3)}>
                    Próximo
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-semibold">Conta Criada!</h3>
                <p className="text-gray-400">
                  Verifique seu email para confirmar a conta
                </p>
                <Button className="w-full">Ir para Login</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const LoginWithError = () => (
  <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Radar da Voz</h1>
      </div>

      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Bem-vindo</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Alert */}
          <div className="bg-error-500/10 border border-error-500/30 rounded-lg p-4">
            <p className="text-error-500 text-sm font-semibold">❌ Erro de Login</p>
            <p className="text-sm text-error-400 mt-1">
              Email ou senha incorretos. Tente novamente.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              className="border-error-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="border-error-500"
            />
          </div>

          <Button className="w-full">Entrar</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

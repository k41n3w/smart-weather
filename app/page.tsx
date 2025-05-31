import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bike, Car, Leaf, Umbrella, Book, ArrowRight, ExternalLink } from "lucide-react"
import FeatureCard from "@/components/feature-card"
import HeroAnimation from "@/components/hero-animation"
import { EmailConfirmationDialog } from "@/components/email-confirmation-dialog"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Email Confirmation Dialog */}
      <EmailConfirmationDialog />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">ClimaTempo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-28 lg:py-36">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Previsão do tempo personalizada para o seu dia a dia
              </h1>
              <p className="text-xl text-muted-foreground">
                A maioria dos aplicativos de previsão do tempo apenas exibe dados meteorológicos genéricos, sem
                considerar o impacto do clima no dia a dia das pessoas. Diferentes perfis de usuários precisam de
                recomendações específicas baseadas no clima para planejar suas atividades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Começar agora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#como-funciona">
                  <Button size="lg" variant="outline">
                    Como funciona
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-16 md:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground">
              Fornecer previsões do tempo e recomendações personalizadas para diferentes perfis de usuários.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-start gap-2">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold">Cadastre-se</h3>
                  <p className="text-muted-foreground">
                    Crie sua conta informando sua cidade e escolhendo seu perfil de usuário.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-start gap-2">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold">Acesse seu painel</h3>
                  <p className="text-muted-foreground">
                    Visualize a previsão do tempo atual e dos próximos dias para sua região.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-start gap-2">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold">Receba recomendações</h3>
                  <p className="text-muted-foreground">
                    Obtenha sugestões personalizadas baseadas no clima e no seu perfil de usuário.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preview Card */}
      <section className="py-16 md:py-28">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Veja como funciona na prática</h2>
            <p className="text-xl text-muted-foreground">
              Confira um exemplo de como nossas recomendações personalizadas podem ajudar você a planejar melhor seu
              dia.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900 dark:to-indigo-900 border-0 shadow-lg">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">Recomendações personalizadas para seu perfil</h3>
                <p className="text-lg mb-6">
                  Veja como diferentes perfis de usuários recebem recomendações específicas baseadas nas condições
                  climáticas atuais.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <Bike className="h-4 w-4" />
                    </div>
                    <span>Atletas recebem dicas para treinos seguros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <Car className="h-4 w-4" />
                    </div>
                    <span>Motoristas são alertados sobre condições das estradas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-primary/20 p-1 rounded-full">
                      <Umbrella className="h-4 w-4" />
                    </div>
                    <span>Turistas descobrem atividades adequadas para o clima</span>
                  </li>
                </ul>
                <Link href="/exemplo">
                  <Button size="lg" className="gap-2">
                    Ver exemplos de recomendações
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="w-full md:w-1/3 aspect-square md:aspect-auto md:h-[300px] rounded-lg overflow-hidden shadow-md bg-gradient-to-b from-sky-400 to-blue-500 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">24°C</div>
                    <div className="text-xl">Parcialmente nublado</div>
                    <div className="mt-2 text-sm opacity-80">Veja exemplos completos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Recursos</h2>
            <p className="text-xl text-muted-foreground">
              Nossa plataforma oferece recursos exclusivos para tornar sua experiência mais completa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="Previsão detalhada"
              description="Acesse informações detalhadas sobre temperatura, umidade, vento e precipitação para sua região."
              icon="cloud"
            />
            <FeatureCard
              title="Recomendações personalizadas"
              description="Receba sugestões específicas para seu perfil, ajudando você a planejar melhor suas atividades."
              icon="sparkles"
            />
            <FeatureCard
              title="Alertas de clima"
              description="Seja notificado sobre mudanças climáticas importantes que possam afetar seu dia."
              icon="bell"
            />
            <FeatureCard
              title="Visualização animada"
              description="Veja animações que representam as condições climáticas atuais para uma experiência mais imersiva."
              icon="sun"
            />
          </div>
        </div>
      </section>

      {/* Profiles */}
      <section className="py-16 md:py-28">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Perfis de usuário</h2>
            <p className="text-xl text-muted-foreground">
              Escolha o perfil que melhor se adapta às suas necessidades e receba recomendações personalizadas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <ProfileCard
              title="Atleta"
              description="Recomendações para treinos e atividades ao ar livre"
              icon={<Bike className="h-8 w-8" />}
            />
            <ProfileCard
              title="Motorista"
              description="Informações sobre condições das estradas"
              icon={<Car className="h-8 w-8" />}
            />
            <ProfileCard
              title="Agricultor"
              description="Insights para atividades agrícolas"
              icon={<Leaf className="h-8 w-8" />}
            />
            <ProfileCard
              title="Turista"
              description="Sugestões de atividades baseadas no clima"
              icon={<Umbrella className="h-8 w-8" />}
            />
            <ProfileCard
              title="Estudante"
              description="Planejamento de atividades acadêmicas"
              icon={<Book className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 shadow-lg">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Pronto para começar?</h2>
              <p className="text-xl mb-8">
                Cadastre-se agora e comece a receber recomendações personalizadas baseadas no clima para o seu perfil.
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Criar conta gratuita
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">ClimaTempo</h3>
              <p className="text-sm text-muted-foreground">
                Previsão do tempo personalizada para diferentes perfis de usuários.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Links</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Início
              </Link>
              <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground">
                Como funciona
              </Link>
              <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
                Cadastro
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Legal</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Termos de uso
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Política de privacidade
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Contato</h3>
              <p className="text-sm text-muted-foreground">contato@climatempo.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ClimaTempo. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProfileCard({ title, description, icon }) {
  return (
    <Card className="flex flex-col items-start p-6">
      <div className="bg-primary/10 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  )
}

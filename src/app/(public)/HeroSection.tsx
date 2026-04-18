import { HeroRequestCard } from "./HeroRequestCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Ayuda experta para <br />
            <span className="text-primary">cada tarea</span>
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            Encuentra profesionales verificados en minutos para más de 200
            servicios. Rápido, seguro y listo cuando lo necesitas.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-xl shadow-slate-900/5 md:p-8 lg:p-10">
          <HeroRequestCard />
        </div>
      </div>
    </section>
  );
}

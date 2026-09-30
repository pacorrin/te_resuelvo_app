import Link from "next/link";
import type { ReactNode } from "react";
import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { legalConfig } from "@/src/lib/legal/legal-config";

export function LegalDocument({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 px-4 py-10 md:px-6">
        <article className="mx-auto max-w-3xl">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              {legalConfig.tradeName}
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground text-pretty">
            {description}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {legalConfig.updatedLabel}
          </p>
          <div className="mt-10 space-y-8">{children}</div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline [&_li]:mt-1.5 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

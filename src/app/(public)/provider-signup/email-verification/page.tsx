import { redirect } from "next/navigation";
import { UserService } from "@/src/lib/services/user.service";
import EmailVerificationContent from "./email-verification-content";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicFooter } from "@/src/components/PublicFooter";

export default async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { email?: string; h?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams.email;
  const hash = resolvedSearchParams.h;
  if (!email || !hash) {
    redirect("/login");
  }
  const result = await UserService.validateSignupHash(hash);
  if (!result) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <EmailVerificationContent email={email} />
      <PublicFooter />
    </div>
  );
}

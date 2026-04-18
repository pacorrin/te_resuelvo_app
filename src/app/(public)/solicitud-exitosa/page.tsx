"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SuccessPage } from "./SuccessPage";

export default function SolicitudExitosaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? undefined;
  const requestNumber =
    searchParams.get("requestNumber") ?? "L-000000";

  const onNavigate = (
    page:
      | "home"
      | "category"
      | "provider"
      | "dashboard"
      | "contact"
      | "how-it-works"
  ) => {
    switch (page) {
      case "home":
        router.push("/");
        break;
      case "category":
        router.push("/services");
        break;
      case "provider":
        router.push("/login");
        break;
      case "dashboard":
        router.push("/");
        break;
      case "contact":
        router.push("/contacto");
        break;
      case "how-it-works":
        router.push("/how-it-works");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <SuccessPage
      onNavigate={onNavigate}
      email={email}
      requestNumber={requestNumber}
    />
  );
}

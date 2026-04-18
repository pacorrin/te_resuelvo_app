"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RedirectionComponent() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft === 0) {
      router.replace("/login");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, router]);

  return (
    <div className="text-center">
      <p>Redirigiendo en {timeLeft} segundos</p>
    </div>
  );
}

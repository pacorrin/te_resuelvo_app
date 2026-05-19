"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { toastError, toastSuccess } from "@/src/lib/utils";
import { _getExampleById } from "@/src/lib/actions/example.actions";

export function ExampleClient({ initialId }: { initialId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleLoad() {
    setLoading(true);
    try {
      const res = await _getExampleById(initialId);
      if (!res.success) {
        toastError(res.error ?? "Error");
        return;
      }
      toastSuccess("OK");
      // TODO: set local state from res.data
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" disabled={loading} onClick={handleLoad}>
      Cargar
    </Button>
  );
}

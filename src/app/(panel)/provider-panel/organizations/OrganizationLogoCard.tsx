"use client";

import * as React from "react";
import { Camera, Building2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Spinner } from "@/src/components/ui/spinner";
import { _uploadOrganizationLogo } from "@/src/lib/actions/organization.actions";
import { toastError, toastSuccess } from "@/src/lib/utils";

export function OrganizationLogoCard({
  organizationId,
  logo,
}: {
  organizationId: number  ;
  logo: string | null;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(logo ? `/api/files/${logo}` : null);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastError("Selecciona un archivo de imagen.");
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreview;
    });

    setIsUploading(true);
    try {
      const result = await _uploadOrganizationLogo(organizationId, file);
      if (result.success) {
        toastSuccess("Logo subido correctamente.");
      } else {
        toastError(result.error ?? "No se pudo subir el logo.");
      }
    } catch {
      toastError("Error al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Logo de la Organización</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.svg"
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={onFileChange}
        />
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading}
            className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4 relative group overflow-hidden border-0 p-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Logo de la organización"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <Building2 className="w-12 h-12 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Camera className="w-6 h-6 text-white" />
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
                <Spinner className="size-8" />
              </div>
            )}
          </button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFilePicker}
            disabled={isUploading}
          >
            {isUploading ? "Subiendo…" : "Cambiar logo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

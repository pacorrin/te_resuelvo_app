"use client";

import { useCallback, useState } from "react";
import type { MapboxAddressDetails } from "@/src/components/MapboxLocationPicker";
import { FormStepper } from "@/src/components/FormStepper";
import {
  CUSTOMER_REQUEST_FORM_STEPS,
  CustomerRequestForm,
} from "./CustomerRequestForm";
import { HeroRequestVisual } from "./HeroRequestVisual";
import { cn } from "@/src/lib/utils";

export function HeroRequestCard() {
  const [activeStep, setActiveStep] = useState(0);
  /** Map loads only after the user focuses/opens a location-related control in the form */
  const [mapPickerMounted, setMapPickerMounted] = useState(false);
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelect = useCallback(
    (
      location: { latitude: number; longitude: number },
      details?: MapboxAddressDetails | null,
    ) => {
      setSelectedLocation({ lat: location.latitude, lng: location.longitude });
      if (details?.formattedAddress) {
        setAddressLine(details.formattedAddress);
      }
      if (details?.postalCode) {
        setPostalCode(details.postalCode);
      }
    },
    [],
  );

  return (
    <div className="space-y-6">
      <FormStepper
        steps={[...CUSTOMER_REQUEST_FORM_STEPS]}
        currentStep={activeStep}
      />

      <div
        className={cn(
          "grid grid-cols-1 items-stretch gap-10 lg:gap-12",
          activeStep === 0 && "lg:grid-cols-2",
        )}
      >
        <CustomerRequestForm
          addressLine={addressLine}
          setAddressLine={setAddressLine}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          mapPickerMounted={mapPickerMounted}
          onOpenMapPicker={() => setMapPickerMounted(true)}
          selectedLocation={selectedLocation}
          activeStep={activeStep}
          onActiveStepChange={setActiveStep}
        />
        <div
          className={cn(activeStep !== 0 && "hidden")}
          aria-hidden={activeStep !== 0}
        >
          <HeroRequestVisual
            mapPickerMounted={mapPickerMounted}
            addressLine={addressLine}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>
    </div>
  );
}

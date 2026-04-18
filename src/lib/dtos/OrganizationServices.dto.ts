import { ServiceDTO } from "./Services.dto";

export interface OrganizationServiceDTO{
  id: number;
  organizationId: number;
  serviceId: number;
  service?: ServiceDTO | null;
}

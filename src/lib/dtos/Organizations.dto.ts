import { OrganizationBusinessType } from "../enums/organizations.enum";
import type { CreateOrganizationCoverageAreaDTO } from "./OrganizationCoverageArea.dto";

export interface OrganizationDTO {
  id: number;
  name: string;
  businessType: OrganizationBusinessType;
  rfc: string;
  contactEmail: string;
  phone: string;
  fiscalAddress: string;
  description?: string | null;
  image?: string | null;
  administratorId?: number | null;
  credits: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationDTO {
  name: string;
  businessType: string;
  rfc: string;
  contactEmail: string;
  phone: string;
  fiscalAddress: string;
  description?: string;
  image?: string;
  administratorId?: number;
  coverageZones?: CreateOrganizationCoverageAreaDTO[];
}

export interface UpdateOrganizationDTO {
  name?: string;
  businessType?: OrganizationBusinessType;
  rfc?: string;
  contactEmail?: string;
  phone?: string;
  fiscalAddress?: string;
  description?: string;
  image?: string;
  administratorId?: number;
  credits?: number;
  status?: number;
}

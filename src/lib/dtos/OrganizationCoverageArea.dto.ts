export interface OrganizationCoverageAreaDTO {
  id: number;
  organizationId: number;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  address?: string;
  createdAt: Date;
}

export interface CreateOrganizationCoverageAreaDTO {
  organizationId: number;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  address?: string;
}

export type CreateCoverageAreaDTO = CreateOrganizationCoverageAreaDTO;

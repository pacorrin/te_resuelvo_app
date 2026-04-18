export interface ServiceDTO {
  id: number;
  name: string;
  leadPrice: number;
  description?: string | null;
  businessSectorId: number;
  /** Present when loaded with sector lookup (e.g. search in panel). */
  businessSectorName?: string | null;
  createdAt: Date;
}

export interface CreateServiceDTO {
  name: string;
  leadPrice?: number;
  description?: string;
  businessSectorId: number;
}

export interface UpdateServiceDTO {
  name?: string;
  leadPrice?: number;
  description?: string | null;
  businessSectorId?: number;
}

export type PostProps = {
  id: number;
  location: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  createdById: string;
};

export type CreatedBy = {
  id: string;
  name: string;
  email: string;
};

export type UpdatePostParams = {
  id: number;
  location: string;
  description?: string;
  image?: string;
};

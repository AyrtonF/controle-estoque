
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInput {
  name: string;
  parentId?: string;
}

export interface IProject {
  uid: string;
  name: string;
  description: string;
  content: string;
  icon_image: string;
  featured_image: string;
  menu01?: string;
  menu02?: string;
  date: string;
}

export type IProjectList = [] | IProject[];

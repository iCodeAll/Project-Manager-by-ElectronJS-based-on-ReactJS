export interface IProject{
    id?: string,
    name: string,
    description: string,
    content?: string,
    icon_image?: string,
    featured_image?: string,
    date?: string
}

export type IProjectList = [] | IProject[]
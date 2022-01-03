export type ObjectEntity = object & { id: number; [key: string]: any };
export type ListObjectEntity = ObjectEntity & {
  path: string;
  name: string;
};

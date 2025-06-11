export interface ICreatePromptHistoryItem {
  role: string;
  parts: Part[];
}

export type ICreatePromptHistoryResponse = ICreatePromptHistoryItem[];

interface Part {
  text: string;
}

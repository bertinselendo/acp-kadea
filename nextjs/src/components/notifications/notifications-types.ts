export type notificationType = {
  id?: string;
  senderEmail: string;
  senderName: string;
  userEmail: string[];
  type?: string;
  date?: any;
  reference: string;
  text?: string;
  link: string;
  isRead?: boolean;
};

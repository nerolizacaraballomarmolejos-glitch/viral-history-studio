export type Platform = "tiktok" | "instagram" | "youtube";

export interface PublishPayload {
  platform: Platform;
  videoUrl: string;
  title: string;
  description: string;
  hashtags: string[];
  characterName: string;
}

export interface PublishResult {
  success: boolean;
  platform: Platform;
  postId?: string;
  postUrl?: string;
  message: string;
  requiresAuth?: boolean;
  authUrl?: string;
}

export function buildCaption(description: string, hashtags: string[]): string {
  const tags = hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ");
  return `${description}\n\n${tags}`.trim();
}

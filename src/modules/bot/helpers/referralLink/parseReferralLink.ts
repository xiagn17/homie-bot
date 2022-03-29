export function parseReferralChatIdFromLink(deepLink: string | null): string | undefined {
  if (!deepLink) {
    return undefined;
  }
  if (!deepLink.includes('ref_')) {
    return undefined;
  }

  return deepLink.split('ref_')[1];
}

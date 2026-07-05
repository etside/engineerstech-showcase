export function setPageMeta(title: string, description: string, canonical?: string) {
  document.title = title;
  let desc = document.querySelector('meta[name="description"]');
  if (!desc) { desc = document.createElement('meta'); (desc as HTMLMetaElement).name = 'description'; document.head.appendChild(desc); }
  (desc as HTMLMetaElement).content = description;
  let can = document.querySelector('link[rel="canonical"]');
  if (!can) { can = document.createElement('link'); (can as HTMLLinkElement).rel = 'canonical'; document.head.appendChild(can); }
  (can as HTMLLinkElement).href = canonical || window.location.href;
}

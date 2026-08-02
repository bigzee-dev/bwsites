export function scrollToHash(
  e: React.MouseEvent<HTMLAnchorElement>,
  hash: string,
) {
  e.preventDefault();
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    history.pushState(null, "", hash);
  }
}

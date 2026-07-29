export default function infiniteScroll(
  listing: HTMLElement | string,
  callback: () => void,
): () => void {
  let listingElement: HTMLElement;

  if (typeof listing === 'string') {
    listingElement = document.querySelector(listing) as HTMLElement;
  } else {
    listingElement = listing;
  }

  const offset = 24;
  let ticking = false;
  function scrollListener(): void {
    const load =
      listingElement.scrollTop + listingElement.clientHeight >=
      listingElement.scrollHeight - offset;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (load) {
          callback();
        }
        ticking = false;
      });

      ticking = true;
    }
  }

  listingElement.addEventListener('scroll', scrollListener, { passive: true });

  return () => listingElement.removeEventListener('scroll', scrollListener);
}

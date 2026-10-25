(() => {
  // Show one random partner per rotating ad block. Without JavaScript the first one stays visible.
  for (const block of document.querySelectorAll('.article-promo[data-rotate]')) {
    const cards = [...block.children];
    const pick = Math.floor(Math.random() * cards.length);
    cards.forEach((card, i) => { card.hidden = i !== pick; });
  }
})();

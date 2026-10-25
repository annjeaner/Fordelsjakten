(() => {
  const grid = document.querySelector('.blog-grid');
  const controls = document.querySelector('.blog-controls');
  if (!grid || !controls) return;
  const cards = [...grid.querySelectorAll('.blog-card')];
  const category = document.querySelector('#blog-category');
  const sort = document.querySelector('#blog-sort');
  const status = document.querySelector('.blog-result-count');
  const collator = new Intl.Collator('nb');
  function update() {
    const ordered = [...cards].sort((a, b) => {
      const titleOrder = collator.compare(a.dataset.title, b.dataset.title);
      if (sort.value === 'title') return titleOrder;
      const dateOrder = a.dataset.date.localeCompare(b.dataset.date);
      return (sort.value === 'oldest' ? dateOrder : -dateOrder) || titleOrder;
    });
    let count = 0;
    for (const card of ordered) {
      card.hidden = category.value !== '' && card.dataset.category !== category.value;
      if (!card.hidden) count++;
      grid.append(card);
    }
    status.textContent = count === 0 ? 'Ingen artikler i denne kategorien.' : `${count} ${count === 1 ? 'artikkel' : 'artikler'}`;
  }
  category.addEventListener('change', update);
  sort.addEventListener('change', update);
  update();
  controls.hidden = false;
  status.hidden = false;
})();

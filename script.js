const sortDropdown = document.getElementById('sort');
const searchField = document.getElementById('search');
const displayDropdown = document.getElementById('display');

const loadStorage = async () => {
  searchField.value = window.localStorage.getItem('search') ?? '';

  displayDropdown.value = window.localStorage.getItem('display') ?? '';
  document.querySelector('main').className = displayDropdown.value;

  sortDropdown.value = window.localStorage.getItem('sort') ?? 'none';

  renderColors(sortDropdown.value);
};

const fetchColors = async () => {
  const res = await fetch('colors.json');
  return await res.json();
};

const renderColors = async (sort = 'none') => {
  let colors = await fetchColors();
  const main = document.querySelector('main');

  if (sort !== 'none') {
    colors.sort((aName, bName) => {
      const a = tinycolor(aName);
      const b = tinycolor(bName);

      if (sort === 'luminance') return a.getLuminance() - b.getLuminance();
      if (sort === 'hue') return a.toHsv().h - b.toHsv().h;
      if (sort === 'saturation') return a.toHsv().s - b.toHsv().s;
    });
  }

  main.innerHTML = '';

  colors.forEach(colorname => {
    const tc = tinycolor(colorname);

    const color = document.createElement('div');
    color.className = 'color';
    color.style.background = colorname;
    color.dataset.name = colorname;
    color.style.color = tinycolor.mostReadable(colorname, ['black', 'white']);
    const name = document.createElement('span');
    name.className = 'name';
    name.appendChild(document.createTextNode(colorname));
    color.appendChild(name);
    const hex = document.createElement('span');
    hex.className = 'hex';
    hex.appendChild(document.createTextNode(tc.toHexString()));
    color.appendChild(hex);
    main.appendChild(color);
  });

  if (searchField.value !== '') filterColors(searchField.value);
};

const filterColors = async (q = '') => {
  window.localStorage.setItem('search', q);
  document.querySelectorAll('.color').forEach(color => {
    if (q === '' || color.dataset.name.includes(q)) {
      color.classList.remove('hidden');
    } else {
      color.classList.add('hidden');
    }
  });
};

loadStorage();

sortDropdown.addEventListener('change', () => {
  window.localStorage.setItem('sort', sortDropdown.value);
  renderColors(sortDropdown.value);
});

searchField.addEventListener('input', () => filterColors(searchField.value));

displayDropdown.addEventListener('change', () => {
  window.localStorage.setItem('display', displayDropdown.value);
  document.querySelector('main').className = displayDropdown.value;
});

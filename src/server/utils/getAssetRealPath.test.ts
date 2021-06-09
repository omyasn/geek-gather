import getAssetRealPath from './getAssetRealPath';

const assetsData = {
  "main": {
    "css": "/css/main.289e0274974a1968a230.css",
    "js": "/js/main.bundle.4653ae2bb5abce9d3a0f.js"
  },
}

test('css', () => {
    const test = getAssetRealPath('css/main.css');
    expect(test).toBe('/css/main.289e0274974a1968a230.css');
});

test('js', () => {
    const test = getAssetRealPath('js/main.bundle.js');
    expect(test).toBe('/js/main.bundle.4653ae2bb5abce9d3a0f.js');
});
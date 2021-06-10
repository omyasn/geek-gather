import { getAssetRealPath } from './getAssetRealPath';

const getFakeAssets = () => (
  {
    "main":{
      "css":"/css/main.62015ea5f1811e099389.css",
      "js":"/js/main.bundle.1567d1257b4f6447780d.js"
    },
    "search":{
      "css":"/css/search.css",
      "js":"/js/search.bundle.js"
    }
  }
);

test('css prod', () => {
    const test = getAssetRealPath(getFakeAssets)('css/main.css');
    expect(test).toEqual(
      expect.stringMatching(/^\/css\/main(\.\w+)?\.css$/)
    );
});

test('css dev', () => {
    const test = getAssetRealPath(getFakeAssets)('css/search.css');
    expect(test).toEqual(
      expect.stringMatching(/^\/css\/search(\.\w+)?\.css$/)
    );
});

test('js prod', () => {
    const test = getAssetRealPath(getFakeAssets)('js/main.bundle.js');
    expect(test).toEqual(
      expect.stringMatching(/^\/js\/main\.bundle(\.\w+)?\.js$/)
    );
});

test('js dev', () => {
    const test = getAssetRealPath(getFakeAssets)('js/search.bundle.js');
    expect(test).toEqual(
      expect.stringMatching(/^\/js\/search\.bundle(\.\w+)?\.js$/)
    );
});
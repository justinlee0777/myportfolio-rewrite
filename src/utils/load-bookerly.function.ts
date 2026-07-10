export function loadBookerly(): Promise<void> {
  const loadFonts = [
    [undefined, '/Bookerly/Bookerly-Regular.ttf'] as const,
    [{ weight: 'bold' }, '/Bookerly/Bookerly-Bold.ttf'] as const,
    [{ style: 'italic' }, '/Bookerly/Bookerly-Italic.ttf'] as const,
  ].map(
    ([descriptor, url]: readonly [FontFaceDescriptors | undefined, string]) => {
      const fontFace = new FontFace('Bookerly', `url(${url})`, descriptor);

      document.fonts.add(fontFace);

      return fontFace.load();
    },
  );

  return Promise.all(loadFonts).then();
}

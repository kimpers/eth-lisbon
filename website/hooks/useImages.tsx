import { useState, useEffect } from 'react';

function useImages() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/punks`);
      const imageData = await res.json();
      const urls = [];
      for (let data of imageData) {
          urls.push(data.image);
      }
      setImageUrls(urls);
      setLoading(false);
    })();
  }, []);

  return { imageUrls, imagesLoading: loading };
}

export { useImages };

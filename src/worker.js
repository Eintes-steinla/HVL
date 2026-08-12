// src/worker.js
// Worker vua phuc vu web tinh (HTML/CSS/JS), vua lam trung gian phat nhac/anh tu R2
// kem cache header dung cach (vi domain r2.dev khong ho tro custom cache header)

const R2_DEV_URL = "https://pub-5cee7735d10d4f61896814b089cfc9a8.r2.dev";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Duong dan /media/* -> lay tu R2, tra ve kem cache header
    if (url.pathname.startsWith("/media/")) {
      const r2Path = url.pathname.replace("/media", "");
      const r2Url = R2_DEV_URL + r2Path;

      const r2Response = await fetch(r2Url, {
        headers: request.headers, // giu Range header de ho tro tua nhanh trong audio
      });

      const newHeaders = new Headers(r2Response.headers);
      newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

      return new Response(r2Response.body, {
        status: r2Response.status,
        headers: newHeaders,
      });
    }

    // Con lai -> phuc vu web binh thuong (HTML/CSS/JS)
    return env.ASSETS.fetch(request);
  },
};

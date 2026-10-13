import SIZES from "../../clip-sizes.json";

const HEADERS = {
  "Accept-Ranges": "bytes",
  "Cache-Control": "public, max-age=31536000, immutable",
  "X-Robots-Tag": "noindex, noimageindex",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Content-Disposition": "inline",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function respond(asset, status = asset.status, body = asset.body, contentRange = "") {
  const headers = new Headers(asset.headers);
  for (const [key, value] of Object.entries(HEADERS)) headers.set(key, value);
  if (contentRange) headers.set("Content-Range", contentRange);
  if (body !== asset.body) headers.delete("Content-Length");
  return new Response(body, { status, headers });
}

function slice(body, start, length) {
  const reader = body.getReader();
  let skip = start;
  let left = length;
  const source = new ReadableStream({
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) return controller.close();
        if (skip >= value.byteLength) {
          skip -= value.byteLength;
          continue;
        }
        const part = value.subarray(skip, skip + left);
        skip = 0;
        left -= part.byteLength;
        controller.enqueue(part);
        if (left === 0) {
          controller.close();
          await reader.cancel();
        }
        return;
      }
    },
    cancel: (reason) => reader.cancel(reason),
  });
  const { readable, writable } = new FixedLengthStream(length);
  source.pipeTo(writable).catch(() => {});
  return readable;
}

export async function onRequest({ request, next }) {
  const { origin, pathname } = new URL(request.url);
  const referer = request.headers.get("Referer") || "";
  if (!referer.startsWith(`${origin}/`)) return Response.redirect(`${origin}/`, 307);

  const forwarded = new Headers(request.headers);
  forwarded.delete("Range");
  const asset = await next(new Request(request, { headers: forwarded }));

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range") || "");
  const size = SIZES[decodeURIComponent(pathname.slice("/clips/".length))];
  if (!range || range[1] + range[2] === "" || asset.status !== 200 || !asset.body || !size) {
    return respond(asset);
  }

  const [, first, last] = range;
  const start = first === "" ? Math.max(0, size - Number(last)) : Number(first);
  const end = first === "" || last === "" ? size - 1 : Math.min(Number(last), size - 1);
  if (start > end) {
    await asset.body.cancel();
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }

  const length = end - start + 1;
  const body = length === size ? asset.body : slice(asset.body, start, length);
  return respond(asset, 206, body, `bytes ${start}-${end}/${size}`);
}

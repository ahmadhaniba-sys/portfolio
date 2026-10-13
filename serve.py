"""Local preview server. Unlike python -m http.server it answers Range requests,
which browsers need to loop and seek large video files smoothly."""

import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
CHUNK = 256 * 1024


class Handler(SimpleHTTPRequestHandler):
    span = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        self.span = None
        header = self.headers.get("Range", "").strip()
        match = re.fullmatch(r"bytes=(\d*)-(\d*)", header)
        path = self.translate_path(self.path)
        if not match or not os.path.isfile(path) or match.groups() == ("", ""):
            return super().send_head()

        size = os.path.getsize(path)
        first, last = match.groups()
        if first == "":
            start, end = max(0, size - int(last)), size - 1
        else:
            start, end = int(first), min(int(last) if last else size - 1, size - 1)
        if start > end or start >= size:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        source = open(path, "rb")
        source.seek(start)
        self.span = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(self.span))
        self.end_headers()
        return source

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def copyfile(self, source, output):
        left = self.span if self.span is not None else float("inf")
        try:
            while left > 0:
                chunk = source.read(int(min(CHUNK, left)))
                if not chunk:
                    break
                output.write(chunk)
                left -= len(chunk)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            # The browser drops the connection whenever the visitor switches clips.
            pass

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    print(f"Serving {ROOT} at http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()

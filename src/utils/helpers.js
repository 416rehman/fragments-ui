export const conversionTable = {
    "text/plain": ["txt"],
    "text/plain; charset=utf-8": ["txt"],
    "text/markdown": ["md", "html", "txt"],
    "text/html": ["html", "md", "txt"],
    "application/json": ["json", "txt"],
    "image/png": ["png", "jpeg", "webp", "gif", "jpg"],
    "image/jpeg": ["jpeg", "png", "webp", "gif"],
    "image/webp": ["webp", "png", "jpeg", "gif", "jpg"],
    "image/gif": ["gif", "png", "jpeg", "webp", "jpg"],
    "image/jpg": ["jpg", "png", "webp", "gif"],
};

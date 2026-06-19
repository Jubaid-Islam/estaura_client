
export const cloudinaryUrl = (url, { width, height, quality = 100 } = {}) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  let transformation = `q_${quality},f_auto`;
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;

  return url.replace("/upload/", `/upload/${transformation}/`);
};
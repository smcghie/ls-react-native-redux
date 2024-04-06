export const convertExifDateToReadable = (exifDate: string) => {
    if (!exifDate) {
      return "Date not available";
    }
    return new Date(exifDate).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: '2-digit',
      // minute: '2-digit',
      // second: '2-digit',
      timeZone: "UTC",
    });
  };
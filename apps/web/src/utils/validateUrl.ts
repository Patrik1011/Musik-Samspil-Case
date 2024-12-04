export const formatAndValidateURL = (website: string): string | null => {
  try {
    let formattedUrl = website.replace(/^www\./, "");

    formattedUrl =
      formattedUrl.startsWith("http://") || formattedUrl.startsWith("https://")
        ? formattedUrl
        : `https://${formattedUrl}`;

    const validatedUrl = new URL(formattedUrl);

    if (validatedUrl.protocol === "http:" || validatedUrl.protocol === "https:") {
      return validatedUrl.href;
    }
    console.error("Invalid protocol:", validatedUrl.protocol);
    return null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

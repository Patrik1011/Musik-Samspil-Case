export const formatAndValidateURL = (website: string): string | null => {
  try {
    let formattedURL = website.replace(/^www\./, "");

    formattedURL =
      formattedURL.startsWith("http://") || formattedURL.startsWith("https://")
        ? formattedURL
        : `https://${formattedURL}`;

    const validatedUrl = new URL(formattedURL);

    if (
      validatedUrl.protocol === "http:" ||
      validatedUrl.protocol === "https:"
    ) {
      return validatedUrl.href;
    } else {
      console.error("Invalid protocol:", validatedUrl.protocol);
      return null;
    }
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

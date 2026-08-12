export const handleVerbPdfGeneratorClick = async (verbName: string) => {
  if (!verbName) {
    return;
  }

  try {
    const response = await fetch("/api/grammar/pdf-generator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verbName }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      throw new Error(data.message || "Failed to generate verb PDF.");
    }

    const pdfBlob = await response.blob();
    const pdfUrl = window.URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = pdfUrl;
    downloadLink.download = `${verbName}.pdf`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.URL.revokeObjectURL(pdfUrl);
  } catch (error) {
    console.error("Failed to request verb PDF generation.", error);
  }
};

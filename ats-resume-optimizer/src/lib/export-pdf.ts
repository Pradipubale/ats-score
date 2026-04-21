import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportElementToPdf(el: HTMLElement, filename = "resume.pdf") {
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  let w = pageW;
  let h = pageW / ratio;
  if (h > pageH) {
    h = pageH;
    w = pageH * ratio;
  }
  pdf.addImage(img, "PNG", (pageW - w) / 2, 0, w, h, undefined, "FAST");
  pdf.save(filename);
}

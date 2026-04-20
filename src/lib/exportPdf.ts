import { jsPDF } from "jspdf";

const INDIGO: [number, number, number] = [99, 102, 241]; // primary indigo
const EMERALD: [number, number, number] = [52, 211, 153];
const ZINC_950: [number, number, number] = [9, 9, 11];
const ZINC_400: [number, number, number] = [161, 161, 170];
const ZINC_100: [number, number, number] = [244, 244, 245];

export interface ExportPdfInput {
  title: string;
  brief: string;
  spec: string;
  confidence: number;
  updatedAt?: string;
}

export function exportSpecToPdf({ title, brief, spec, confidence, updatedAt }: ExportPdfInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;

  // ── Cover page ──
  doc.setFillColor(...ZINC_950);
  doc.rect(0, 0, pageW, pageH, "F");

  // Indigo accent bar
  doc.setFillColor(...INDIGO);
  doc.rect(0, 0, 6, pageH, "F");

  // Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INDIGO);
  doc.text("SPECMIRROR", margin, margin + 8);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...ZINC_100);
  const titleLines = doc.splitTextToSize(title || "Untitled Brief", pageW - margin * 2);
  doc.text(titleLines, margin, pageH / 2 - 40);

  // Confidence badge
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...EMERALD);
  doc.text(`Confidence: ${confidence}%`, margin, pageH / 2 + 20);

  // Date footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...ZINC_400);
  const dateLine = updatedAt
    ? `Generated ${new Date(updatedAt).toLocaleDateString()}`
    : `Generated ${new Date().toLocaleDateString()}`;
  doc.text(dateLine, margin, pageH - margin);

  // ── Content pages ──
  const addContentPage = () => {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, pageH, "F");
  };

  let y = margin;
  const contentW = pageW - margin * 2;
  const lineH = 14;

  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - margin - 20) {
      addContentPage();
      y = margin;
    }
  };

  const drawSection = (heading: string, body: string, mono = false) => {
    addContentPage();
    y = margin;

    // Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...ZINC_950);
    doc.text(heading, margin, y);
    y += 6;

    // Indigo underline
    doc.setDrawColor(...INDIGO);
    doc.setLineWidth(2);
    doc.line(margin, y + 4, margin + 40, y + 4);
    y += 24;

    // Body
    doc.setFont(mono ? "courier" : "helvetica", "normal");
    doc.setFontSize(mono ? 9 : 10);
    doc.setTextColor(40, 40, 45);

    const lines = doc.splitTextToSize(body || "(empty)", contentW);
    for (const line of lines) {
      ensureRoom(lineH);
      doc.text(line, margin, y);
      y += lineH;
    }
  };

  drawSection("Brief", brief || "(no brief content)");
  drawSection("Specification", spec || "(no spec content)", true);

  // ── Page numbers ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...ZINC_400);
    doc.text(`${i - 1} / ${pageCount - 1}`, pageW - margin, pageH - margin / 2, { align: "right" });
    doc.text("SpecMirror", margin, pageH - margin / 2);
  }

  const safeName = (title || "spec").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
  doc.save(`${safeName}.pdf`);
}
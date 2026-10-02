import { jsPDF } from 'jspdf';

const displayValue = (value, fallback = 'Not available') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const score = (value, maximum) => `${Number(value || 0)} / ${maximum}`;

const safeFilename = (title) => displayValue(title, 'placement-readiness-batch-report')
  .replace(/[^a-z0-9]+/gi, '-')
  .replace(/(^-|-$)/g, '')
  .toLowerCase();

export const createBatchReportPdf = (report) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  const bottom = pageHeight - 16;
  const metrics = report.metrics || {};
  const students = report.studentSnapshots || [];
  let y = 42;

  const drawHeader = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 34, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('Placement Readiness Batch Report', margin, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Generated ${new Date(report.generatedDate || Date.now()).toLocaleString()}`, margin, 24);
    doc.text(`Prepared by ${report.generatedBy?.name || 'Placement Officer'}`, margin, 29);
    doc.setTextColor(30, 41, 59);
    y = 42;
  };

  const addPage = () => {
    doc.addPage();
    drawHeader();
  };

  const ensureSpace = (height) => {
    if (y + height > bottom) addPage();
  };

  const addSection = (title) => {
    ensureSpace(13);
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title, margin + 4, y + 5.3);
    doc.setTextColor(30, 41, 59);
    y += 13;
  };

  const addKeyValue = (label, value) => {
    const valueText = doc.splitTextToSize(displayValue(value), contentWidth - 52);
    const height = Math.max(6, valueText.length * 4.2);
    ensureSpace(height + 1);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(valueText, margin + 42, y);
    y += height;
  };

  const addMetricCards = () => {
    const cards = [
      { label: 'Students analyzed', value: displayValue(metrics.totalStudents || 0), color: [30, 41, 59] },
      { label: 'Batch average', value: `${metrics.avgReadinessScore || 0} / 100`, color: [37, 99, 235] },
      { label: 'Eligible candidates', value: displayValue(metrics.placedEligibleCount || 0), color: [5, 150, 105] }
    ];
    const gap = 4;
    const cardWidth = (contentWidth - (gap * 2)) / 3;
    ensureSpace(27);
    cards.forEach((card, index) => {
      const x = margin + (index * (cardWidth + gap));
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, y, cardWidth, 22, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(card.label, x + (cardWidth / 2), y + 7, { align: 'center' });
      doc.setTextColor(...card.color);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(card.value, x + (cardWidth / 2), y + 15, { align: 'center' });
    });
    doc.setTextColor(30, 41, 59);
    y += 27;
  };

  const addStudentCard = (student, index) => {
    const cardHeight = 60;
    if (y + cardHeight > bottom) {
      addPage();
      addSection('Student Performance Details (continued)');
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'FD');
    const x = margin + 4;
    const firstRow = y + 7;
    const secondColumn = margin + (contentWidth / 2) + 2;

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${displayValue(student.name, 'Student')}`, x, firstRow);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.text(displayValue(student.email), x, firstRow + 5);
    doc.text(`Department: ${displayValue(student.department)}`, x, firstRow + 10);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`CGPA: ${score(student.cgpa, 10)}`, x, firstRow + 16);
    doc.text(`Backlogs: ${Number(student.backlogs || 0)}`, secondColumn, firstRow + 16);
    doc.text(`Readiness: ${score(student.readinessScore, 100)}`, x, firstRow + 22);
    doc.text(`Category: ${displayValue(student.category)}`, secondColumn, firstRow + 22);

    doc.setFillColor(226, 232, 240);
    doc.rect(x, firstRow + 27, contentWidth - 8, 0.35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Score component breakdown', x, firstRow + 33);

    const breakdown = [
      ['Academic', score(student.cgpaScore, 20)],
      ['Skills', score(student.skillScore, 20)],
      ['Projects', score(student.projectScore, 20)],
      ['Certifications', score(student.certScore, 15)],
      ['Internships', score(student.internshipScore, 10)],
      ['Quiz', score(student.quizScore, 15)]
    ];
    const breakdownWidth = (contentWidth - 8) / 3;
    breakdown.forEach(([label, value], breakdownIndex) => {
      const column = breakdownIndex % 3;
      const row = Math.floor(breakdownIndex / 3);
      const cellX = x + (column * breakdownWidth);
      const cellY = firstRow + 39 + (row * 7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(6.8);
      doc.text(label, cellX, cellY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      doc.text(value, cellX, cellY + 3.8);
    });

    y += cardHeight + 5;
  };

  drawHeader();
  addSection('Report Summary');
  addKeyValue('Report title', report.title);
  addKeyValue('Generated by', report.generatedBy?.name || 'Placement Officer');
  addKeyValue('Generated on', new Date(report.generatedDate || Date.now()).toLocaleString());
  y += 2;
  addMetricCards();
  addSection('Top Skills');
  addKeyValue('Skills', (metrics.topSkills || []).join(', ') || 'Not available');
  y += 2;
  addSection('Student Performance Details');

  if (students.length === 0) {
    addKeyValue('Student records', 'No student records are available for this report.');
  } else {
    students.forEach(addStudentCard);
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('PlacementChecker - System Audit Report', margin, pageHeight - 7);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  return { doc, filename: `${safeFilename(report.title)}.pdf` };
};

export const downloadBatchReportPdf = (report) => {
  const { doc, filename } = createBatchReportPdf(report);
  doc.save(filename);
};

async function generatePDF(mode) {
  const htmlCode = document.getElementById('htmlInput').value;
  const preview = document.getElementById('preview');
  preview.innerHTML = htmlCode; // render pasted HTML

  // Wait for fonts/images to load
  await new Promise(r => setTimeout(r, 500));

  const canvas = await html2canvas(preview, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;

  if (mode === 'single') {
    // Single continuous page
    const pdfWidth = canvas.width * 0.75;  // px → pt
    const pdfHeight = canvas.height * 0.75;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [pdfWidth, pdfHeight]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('singlepage.pdf');
  } else {
    // Multiple A4 pages
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = canvas.height * pageWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('multipage.pdf');
  }
}

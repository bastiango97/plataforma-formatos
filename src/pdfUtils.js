// src/pdfUtils.js
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function createPDF(insuranceCompanyName, formatName, formData) {
  // Fetch the PDF template
  const url = '/pdfs/Solicitud-de-reembolso-v5.pdf';
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the form from the PDF
  const form = pdfDoc.getForm();

  // Enable multiline for 'Estudios' and set value
  const estudiosField = form.getTextField('Estudios');
  estudiosField.enableMultiline();
  estudiosField.setText(formData.Estudios);

  // Enable multiline for 'Diagnóstico' and set value
  const diagnosticoField = form.getTextField('Diagnóstico');
  diagnosticoField.enableMultiline();
  diagnosticoField.setText(formData.diagnostico);

  // Map other fields from submission data
  form.getTextField('Nombre (s)').setText(formData.nombreS);
  form.getTextField('Apellido Paterno').setText(formData.apellidoPaterno);
  form.getTextField('Apellido Materno').setText(formData.apellidoMaterno);
  form.getTextField('Contrante').setText(formData.contratante);
  form.getTextField('Póliza').setText(formData.noDePolizaActual);
  form.getTextField('Póliza2').setText(formData.noDePolizaAnterior);
  form.getTextField('No. Siniestro').setText(formData.numeroDeSiniestro);

  // Map Doctor fields
  form.getTextField('Dr. (a)-1').setText(formData.drA1);
  form.getTextField('Especialidad-1').setText(formData.especialidad1);
  form.getTextField('Dr. (a)-2').setText(formData.drA2);
  form.getTextField('Especialidad-2').setText(formData.especialdiad2);

  // Handle "Reclamaciones" Radio Buttons
  const reclamacionesRadioGroup = form.getRadioGroup('Reclamaciones anteriores por este padecimiento');
  reclamacionesRadioGroup.select(formData.hasPresentadoReclamacionesAnterioresPorEstePadecimiento === 'si' ? 'Sí' : 'No');

  // Handle "Moneda" Radio Buttons
  const monedaRadioGroup = form.getRadioGroup('Moneda comprobantes');
  monedaRadioGroup.select(formData.Moneda === 'monedaNacional' ? 'Nacional' : 'Extranjera');

  form.getTextField('Moneda extranjera').setText(formData.indicaLaMoneda);

  // Map facturas
for (let i = 1; i <= 11; i++) {
    const factura = formData[`factura${i}`];
    const proveedor = formData[`proveedor${i}`];
    const monto = formData[`monto${i}`];
  
    if (factura) {
      form.getTextField(`Recibo-${i}`).setText(factura);
      form.getTextField(`Proveedor-${i}`).setText(proveedor);
      form.getTextField(`Monto-${i}`).setText(monto);
    }
  }
  
  // Calculate and set the total amount
  const total = Array.from({ length: 11 }, (_, i) => formData[`monto${i + 1}`])
    .reduce((sum, monto) => sum + (monto ? parseFloat(monto) : 0), 0);
  form.getTextField('Total').setText(total.toFixed(2));
  
  // Set today's date
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  form.getTextField('Fec_af_date').setText(formattedDate);
  
  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();
  
  // Trigger the download of the filled PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, `${insuranceCompanyName}_${formatName}_filled.pdf`);
}

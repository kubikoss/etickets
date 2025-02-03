document.getElementById("generateBtn").addEventListener("click", generateLabels);
document.getElementById("generateTableBtn").addEventListener("click", generateTableLabels);
document.querySelectorAll('#tabulkyForm input').forEach(input => {
  input.addEventListener('input', updateLabelPreview);
});
document.addEventListener('DOMContentLoaded', updateLabelPreview);
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', handleTabClick);
});
document.querySelectorAll('#etiketyForm input').forEach(input => {
  input.addEventListener('input', updateEanLabelPreview);
});
document.addEventListener('DOMContentLoaded', updateEanLabelPreview);
document.querySelectorAll('#tabulkyForm input').forEach(input => {
  input.addEventListener('input', updateTableLabelPreview);
});
document.addEventListener('DOMContentLoaded', updateTableLabelPreview);

function generateLabels() {
  const prefix = document.getElementById("prefix").value;
  const suffix = document.getElementById("suffix").value;
  const productLabelName = document.getElementById("productLabelName").value;
  const startValue = parseInt(document.getElementById("startValue").value, 10);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const cols = 4; // 4 columns
  const rows = 10; // 10 rows
  const cellWidth = 52; // Adjusted width for 4 columns
  const cellHeight = 29.7; // Adjusted height for 10 rows
  const marginTop = 10; // Top margin
  const marginLeft = 10; // Left margin

  const code = `${prefix}${String(startValue).padStart(4, "0")}${suffix}`;

  pdf.setFontSize(12); // Nastavení velikosti písma na 12
pdf.text(productLabelName, pdf.internal.pageSize.getWidth() / 2, 5, { align: 'center' });

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = marginLeft + col * cellWidth;
      const y = marginTop + row * cellHeight;

      pdf.setFontSize(8); // Set font size to 8
      pdf.text(code, x + 5, y + 10);

      const canvas = document.getElementById("barcode");
      PDF417.draw(code, canvas, '3');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x + 5, y + 12, cellWidth - 15, cellHeight - 20);
    }
  }

  // pdf.save("etikety.pdf");
  pdf.autoPrint();
  pdf.output('dataurlnewwindow');
}

function generateTableLabels() {
  const labelPreviewContent = document.getElementById("labelPreview").innerHTML;
  const labelCount = document.getElementById("labelCount").value;
  
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Table Labels</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          #logoDiv img{ 
            margin-left: 44%;
            background-color: black;
          }
          #logoDiv{ 
            background-color: black;
          }
          .label-container {
            width: 210mm; /* A4 paper width */
            display: grid;
            grid-template-columns: repeat(4, 48.5mm);
            grid-template-rows: repeat(10, 25.4mm);
            gap: 0;
            margin: 0 auto;
          }
          .label {
            width: 48.5mm;
            height: 25.4mm;
            border: 1px solid #000;
            box-sizing: border-box;
            padding: 5px;
            overflow: hidden;
          }
          #labelTable {
            width: 100%;
            font-size: 10px;
            text-align: center;
            table-layout: fixed;
            margin-bottom: 5px;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
          }
          #labelProductName {
            justify-content: center;
            display: flex;
            font-size: 13px;
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          ${Array(Number(labelCount)).fill(`<div class="label">${labelPreviewContent}</div>`).join('')}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function updateLabelPreview() {
  document.getElementById('labelProductName').innerText = document.getElementById('productName').value;
  document.getElementById('labelHeader1').innerText = document.getElementById('header1').value;
  document.getElementById('labelHeader2').innerText = document.getElementById('header2').value;
  document.getElementById('labelHeader3').innerText = document.getElementById('header3').value;
  document.getElementById('labelHeader4').innerText = document.getElementById('header4').value;
  document.getElementById('labelPrice1').innerText = document.getElementById('price1').value;
  document.getElementById('labelPrice2').innerText = document.getElementById('price2').value;
  document.getElementById('labelPrice3').innerText = document.getElementById('price3').value;
  document.getElementById('labelPrice4').innerText = document.getElementById('price4').value;
}

function handleTabClick() {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  this.classList.add('active');
  document.getElementById(this.getAttribute('data-tab')).classList.add('active');
}

function updateEanLabelPreview() {
  const prefix = document.getElementById("prefix").value;
  const suffix = document.getElementById("suffix").value;
  const startValue = parseInt(document.getElementById("startValue").value, 10);
  const code = `${prefix}${String(startValue).padStart(4, "0")}${suffix}`;

  document.getElementById("eanLabelCode").innerText = code;

  const canvas = document.getElementById("eanBarcode");
  PDF417.draw(code, canvas, '3');

}

function updateTableLabelPreview() {
  const productName = document.getElementById("productName").value;
  const headers = [
    document.getElementById("header1").value,
    document.getElementById("header2").value,
    document.getElementById("header3").value,
    document.getElementById("header4").value
  ];
  const prices = [
    document.getElementById("price1").value,
    document.getElementById("price2").value,
    document.getElementById("price3").value,
    document.getElementById("price4").value
  ];

  document.getElementById("labelProductName").innerText = productName;
  document.getElementById("labelHeader1").innerText = headers[0];
  document.getElementById("labelHeader2").innerText = headers[1];
  document.getElementById("labelHeader3").innerText = headers[2];
  document.getElementById("labelHeader4").innerText = headers[3];
  document.getElementById("labelPrice1").innerText = prices[0];
  document.getElementById("labelPrice2").innerText = prices[1];
  document.getElementById("labelPrice3").innerText = prices[2];
  document.getElementById("labelPrice4").innerText = prices[3];
}
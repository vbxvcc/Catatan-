import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Product, Sale, StockTransaction, AppSettings } from '../types';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const exportStockToPDF = (
  products: Product[],
  settings: AppSettings,
  type: 'all' | 'in' | 'out',
  transactions?: StockTransaction[]
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text(settings.storeName || 'Toko', 14, 20);
  doc.setFontSize(10);
  doc.text(settings.storeAddress || '', 14, 28);

  // Title
  doc.setFontSize(14);
  const title =
    type === 'all'
      ? 'Laporan Stok Barang Tersedia'
      : type === 'in'
      ? 'Laporan Barang Masuk'
      : 'Laporan Barang Keluar';
  doc.text(title, 14, 40);

  // Date
  doc.setFontSize(10);
  doc.text(`Tanggal: ${format(new Date(), 'dd MMMM yyyy', { locale: idLocale })}`, 14, 48);

  if (type === 'all') {
    // Stock Available Table
    const tableData = products.map((p) => [
      p.name,
      p.sku,
      p.stock.toString(),
      p.unit,
      `${settings.currency} ${p.buyPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      `${settings.currency} ${p.sellPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
      `${p.profitPercentage.toFixed(2)}%`,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Nama Barang', 'SKU', 'Stok', 'Satuan', 'Harga Beli', 'Harga Jual', 'Profit %']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
  } else if (transactions) {
    // Stock In/Out Table
    const tableData = transactions
      .filter((t) => t.type === (type === 'in' ? 'in' : 'out'))
      .map((t) => [
        format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
        t.productName,
        t.quantity.toString(),
        type === 'in'
          ? `${settings.currency} ${t.buyPrice?.toLocaleString('id-ID', { minimumFractionDigits: 2 }) || '-'}`
          : `${settings.currency} ${t.sellPrice?.toLocaleString('id-ID', { minimumFractionDigits: 2 }) || '-'}`,
        t.createdBy,
        t.notes || '-',
      ]);

    autoTable(doc, {
      startY: 55,
      head: [['Tanggal', 'Nama Barang', 'Jumlah', type === 'in' ? 'Harga Beli' : 'Harga Jual', 'Oleh', 'Catatan']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.text(`© 2025 gilar206@hotmail.co.uk`, 14, doc.internal.pageSize.height - 10);

  doc.save(`${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

export const exportSalesToPDF = (
  sales: Sale[],
  settings: AppSettings,
  title: string,
  filteredSales: Sale[]
) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text(settings.storeName || 'Toko', 14, 20);
  doc.setFontSize(10);
  doc.text(settings.storeAddress || '', 14, 28);

  // Title
  doc.setFontSize(14);
  doc.text(title, 14, 40);

  // Date
  doc.setFontSize(10);
  doc.text(`Tanggal: ${format(new Date(), 'dd MMMM yyyy', { locale: idLocale })}`, 14, 48);

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, s) => sum + s.sellPrice * s.quantity, 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + s.profit * s.quantity, 0);

  // Sales Table
  const tableData = filteredSales.map((s) => [
    format(new Date(s.date), 'dd/MM/yyyy HH:mm'),
    s.productName,
    s.quantity.toString(),
    `${settings.currency} ${s.buyPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
    `${settings.currency} ${s.sellPrice.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
    `${settings.currency} ${(s.profit * s.quantity).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
    `${s.profitPercentage.toFixed(2)}%`,
  ]);

  autoTable(doc, {
    startY: 55,
    head: [['Tanggal', 'Barang', 'Qty', 'Harga Beli', 'Harga Jual', 'Profit', 'Profit %']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    foot: [
      [
        'Total',
        '',
        '',
        '',
        `${settings.currency} ${totalSales.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
        `${settings.currency} ${totalProfit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`,
        '',
      ],
    ],
    footStyles: { fillColor: [52, 152, 219], fontStyle: 'bold' },
  });

  // Footer
  doc.setFontSize(8);
  doc.text(`© 2025 gilar206@hotmail.co.uk`, 14, doc.internal.pageSize.height - 10);

  doc.save(`${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

export const printDocument = (element: HTMLElement) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #2980b9; color: white; }
      .footer { margin-top: 40px; font-size: 12px; text-align: center; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('<div class="footer">© 2025 gilar206@hotmail.co.uk</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
};

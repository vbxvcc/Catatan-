import jsPDF from 'jspdf';
import { Product, Sale, StoreSettings } from '@/types';
import { format } from 'date-fns';

export const generateInventoryPDF = (products: Product[], settings: StoreSettings) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(settings.storeName, 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(settings.address, 105, 28, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Laporan Stok Barang', 105, 40, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Tanggal: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 50);
  
  let y = 60;
  doc.setFontSize(10);
  doc.text('No', 14, y);
  doc.text('Nama Barang', 30, y);
  doc.text('Satuan', 90, y);
  doc.text('Jumlah', 120, y);
  doc.text('Harga Beli', 145, y);
  doc.text('Harga Jual', 175, y);
  
  y += 7;
  doc.line(14, y - 2, 200, y - 2);
  
  products.forEach((product, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    doc.text((index + 1).toString(), 14, y);
    doc.text(product.name.substring(0, 25), 30, y);
    doc.text(product.unit, 90, y);
    doc.text(product.quantity.toString(), 120, y);
    doc.text(formatCurrency(product.purchasePrice, settings.currency), 145, y);
    doc.text(formatCurrency(product.sellingPrice, settings.currency), 175, y);
    
    y += 7;
  });
  
  doc.setFontSize(8);
  doc.text('2025 gilar206@hotmail.co.uk', 105, 285, { align: 'center' });
  
  return doc;
};

export const generateSalesPDF = (sales: Sale[], settings: StoreSettings, title: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(settings.storeName, 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(settings.address, 105, 28, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(title, 105, 40, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Tanggal: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 50);
  
  let y = 60;
  doc.setFontSize(10);
  doc.text('No', 14, y);
  doc.text('Tanggal', 30, y);
  doc.text('Produk', 60, y);
  doc.text('Qty', 110, y);
  doc.text('Harga', 130, y);
  doc.text('Keuntungan', 165, y);
  
  y += 7;
  doc.line(14, y - 2, 200, y - 2);
  
  let totalRevenue = 0;
  let totalProfit = 0;
  
  sales.forEach((sale, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    const revenue = sale.sellingPrice * sale.quantity;
    totalRevenue += revenue;
    totalProfit += sale.profit * sale.quantity;
    
    doc.text((index + 1).toString(), 14, y);
    doc.text(format(new Date(sale.date), 'dd/MM/yy'), 30, y);
    doc.text(sale.productName.substring(0, 20), 60, y);
    doc.text(sale.quantity.toString(), 110, y);
    doc.text(formatCurrency(revenue, settings.currency), 130, y);
    doc.text(formatCurrency(sale.profit * sale.quantity, settings.currency), 165, y);
    
    y += 7;
  });
  
  y += 5;
  doc.line(14, y - 2, 200, y - 2);
  doc.setFontSize(11);
  doc.text('Total Penjualan:', 110, y);
  doc.text(formatCurrency(totalRevenue, settings.currency), 165, y);
  y += 7;
  doc.text('Total Keuntungan:', 110, y);
  doc.text(formatCurrency(totalProfit, settings.currency), 165, y);
  
  doc.setFontSize(8);
  doc.text('2025 gilar206@hotmail.co.uk', 105, 285, { align: 'center' });
  
  return doc;
};

const formatCurrency = (amount: number, currency: string): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

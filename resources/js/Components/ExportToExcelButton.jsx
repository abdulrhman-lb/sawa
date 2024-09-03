import * as XLSX from 'xlsx'; // استبدل المكتبة بـ xlsx-style

export default function ExportToExcelButton({ data, columns, fileName, total_add_all, total_reduce_all, final_balance_all }) {
  const exportToExcel = () => {
    const worksheetData = [
      Object.values(columns), // إضافة أسماء الأعمدة
      ...data.map(item => Object.values(item)), // إضافة البيانات
      ['المجموع', total_add_all, total_reduce_all, '', `الرصيد النهائي: ${final_balance_all}`] // إضافة الإجماليات
    ];

    // إنشاء ورقة عمل من البيانات
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // تعديل تنسيق ورقة العمل
    const wscols = Object.keys(columns).map(() => ({ wpx: 150 })); // عرض الأعمدة
    worksheet['!cols'] = wscols;

    // تعيين الاتجاه من اليمين إلى اليسار
    worksheet['!dir'] = 'rtl'; // من اليمين إلى اليسار

    // إضافة تنسيقات النصوص (اختياري)
    Object.keys(worksheet).forEach((key) => {
      if (worksheet[key].t) { // إذا كانت الخلية تحتوي على نص
        worksheet[key].s = {
          alignment: {
            horizontal: 'center', // النص على اليمين
            vertical: 'center',
          },
          font: {
            name: 'Arial', // نوع الخط
            bold: true, // غامق
            sz: 12, // حجم الخط
            color: { rgb: '000000' }, // لون النص
          },
        };
      }
    });

    // إنشاء ملف Excel جديد
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Center Balance');

    // حفظ ملف Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <button onClick={exportToExcel} className="bg-green-600 text-white py-2 px-4 rounded">
      تصدير إلى Excel
    </button>
  );
}

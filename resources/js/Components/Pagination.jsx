import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams = {} }) {
    // حذف معلمة الصفحة لتجنب تكرارها
    const { page, ...restQueryParams } = queryParams;

    // تحويل باقي المعلمات إلى سلسلة استعلام
    const queryString = new URLSearchParams(restQueryParams).toString();

    return (
        <nav className="text-center mt-4">
            {links.map((link) => {
                // تحديد الترجمة للـ label
                const translatedLabel =
                    link.label === "Next &raquo;" ? "التالي" :
                    link.label === "&laquo; Previous" ? "السابق" :
                    link.label; // استخدم النص الأصلي إذا لم يكن "التالي" أو "السابق"

                return (
                    <Link
                        href={link.url ? `${link.url}${queryString ? '&' + queryString : ''}` : ""}
                        key={link.label}
                        className={
                            "inline-block py-2 px-3 mx-1 rounded-lg dark:text-gray-100 text-gray-900 text-sm " +
                            (link.active ? "bg-gray-900 text-white " : " ") +
                            (!link.url
                                ? "!text-gray-500 cursor-not-allowed "
                                : "hover:bg-gray-950 hover:text-gray-100")
                        }
                        dangerouslySetInnerHTML={{ __html: translatedLabel }}
                    ></Link>
                );
            })}
        </nav>
    );
}

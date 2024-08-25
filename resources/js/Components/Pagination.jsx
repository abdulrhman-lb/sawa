import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams = {} }) {
    // حذف معلمة الصفحة لتجنب تكرارها
    const { page, ...restQueryParams } = queryParams;

    // تحويل باقي المعلمات إلى سلسلة استعلام
    const queryString = new URLSearchParams(restQueryParams).toString();

    return (
        <nav className="text-center mt-4">
            {links.map((link) => (
                <Link
                    href={link.url ? `${link.url}${queryString ? '&' + queryString : ''}` : ""}
                    key={link.label}
                    className={
                        "inline-block py-2 px-3 rounded-lg text-gray-200 text-xs " +
                        (link.active ? "bg-gray-950 " : " ") +
                        (!link.url
                            ? "!text-gray-500 cursor-not-allowed "
                            : "hover:bg-gray-950 ")
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                ></Link>
            ))}
        </nav>
    );
}

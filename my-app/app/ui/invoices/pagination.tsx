"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"; // Іконки стрілок
import clsx from "clsx"; // Утиліта для умовного застосування класів
import Link from "next/link"; // Компонент посилання в Next.js
import { generatePagination } from "@/app/lib/utils"; // Функція для генерації сторінок пагінації
import { usePathname, useSearchParams } from "next/navigation"; // Гаки для роботи з URL у Next.js

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри пошуку
  const currentPage = Number(searchParams.get("page")) || 1; // Поточна сторінка, за замовчуванням 1
  console.log(currentPage);

  // Функція створення URL для певної сторінки
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams); // Копіюємо поточні параметри
    params.set("page", pageNumber.toString()); // Оновлюємо параметр `page`
    return `${pathname}?${params.toString()}`; // Повертаємо новий URL
  };

  // Генеруємо масив сторінок для відображення у пагінації
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      <div className="inline-flex">
        {/* Кнопка для переміщення на попередню сторінку */}
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1} // Деактивуємо, якщо це перша сторінка
        />

        <div className="flex -space-x-px">
          {/* Рендеримо номери сторінок */}
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;

            // Визначаємо позицію сторінки
            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            // Компонент для відображення номера сторінки
            return (
              <PaginationNumber
                key={`${page}-${index}`} // Унікальний ключ для React
                href={createPageURL(page)} // URL для сторінки
                page={page} // Номер сторінки
                position={position} // Позиція
                isActive={currentPage === page} // Визначаємо, чи це активна сторінка
              />
            );
          })}
        </div>

        {/* Кнопка для переміщення на наступну сторінку */}
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages} // Деактивуємо, якщо це остання сторінка
        />
      </div>
    </>
  );
}

// Компонент для відображення окремого номера сторінки
function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string; // Номер сторінки або спеціальний символ ("...")
  href: string; // URL сторінки
  position?: "first" | "last" | "middle" | "single"; // Позиція
  isActive: boolean; // Чи активна сторінка
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border", // Базові стилі
    {
      "rounded-l-md": position === "first" || position === "single", // Скруглення зліва
      "rounded-r-md": position === "last" || position === "single", // Скруглення справа
      "z-10 bg-blue-600 border-blue-600 text-white": isActive, // Стилі для активної сторінки
      "hover:bg-gray-100": !isActive && position !== "middle", // Ховер для неактивної сторінки
      "text-gray-300": position === "middle", // Стилі для "..."
    }
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div> // Якщо активна сторінка або "...", повертаємо <div>
  ) : (
    <Link href={href} className={className}>
      {page} {/* Посилання на сторінку */}
    </Link>
  );
}

// Компонент для стрілок пагінації (ліворуч/праворуч)
function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string; // URL для навігації
  direction: "left" | "right"; // Напрямок
  isDisabled?: boolean; // Чи активна кнопка
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-md border", // Базові стилі
    {
      "pointer-events-none text-gray-300": isDisabled, // Деактивована кнопка
      "hover:bg-gray-100": !isDisabled, // Ховер для активної кнопки
      "mr-2 md:mr-4": direction === "left", // Відступ для лівої кнопки
      "ml-2 md:ml-4": direction === "right", // Відступ для правої кнопки
    }
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" /> // Іконка для лівої кнопки
    ) : (
      <ArrowRightIcon className="w-4" /> // Іконка для правої кнопки
    );

  return isDisabled ? (
    <div className={className}>{icon}</div> // Якщо кнопка деактивована, повертаємо <div>
  ) : (
    <Link className={className} href={href}>
      {icon} {/* Посилання на сторінку */}
    </Link>
  );
}

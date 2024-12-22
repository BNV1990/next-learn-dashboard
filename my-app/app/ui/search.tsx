"use client";

// Імпортуємо необхідні залежності
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Іконка лупи для пошуку
import { useSearchParams, usePathname, useRouter } from "next/navigation"; // Гаки для роботи з URL у Next.js
import { useDebouncedCallback } from "use-debounce"; // Гак для затримки викликів функції

export default function Search({ placeholder }: { placeholder: string }) {
  // Отримуємо поточні параметри пошуку, шлях, та функції для навігації
  const searchParams = useSearchParams(); // Повертає поточні параметри URL у форматі URLSearchParams
  const pathname = usePathname(); // Повертає поточний шлях без параметрів
  const { replace } = useRouter(); // Метод для заміни поточного URL без перезавантаження сторінки

  // Створюємо функцію для пошуку з дебаунсом (затримкою 300 мс)
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams); // Копіюємо поточні параметри
    params.set("page", "1"); // Завжди скидаємо пагінацію на першу сторінку при пошуку
    if (term) {
      params.set("query", term); // Якщо є введений текст, додаємо його до параметра `query`
    } else {
      params.delete("query"); // Якщо тексту немає, видаляємо параметр `query`
    }
    replace(`${pathname}?${params.toString()}`); // Оновлюємо URL з новими параметрами
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      {/* Прихована мітка для покращення доступності */}
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      {/* Поле вводу для пошуку */}
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder} // Встановлюємо текст підказки
        onChange={(e) => {
          handleSearch(e.target.value); // Викликаємо функцію handleSearch при зміні тексту
        }}
        defaultValue={searchParams.get("query")?.toString()} // Встановлюємо поточне значення з параметра `query`
      />

      {/* Іконка пошуку (лупа) */}
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

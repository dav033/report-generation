export default function Input({ label, id, type = "text", value, onChange }) {
  return (
    <label
      htmlFor={id}
      className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600 dark:border-gray-700"
    >
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm dark:text-white"
      />

      <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
        {label}
      </span>
    </label>
  );
}

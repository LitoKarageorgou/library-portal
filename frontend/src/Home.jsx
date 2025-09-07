export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-center">

      {/* Title */}
      <h1 className="text-[2.2rem] font-black text-gray-900 mb-2">
        Welcome to the Library Portal
      </h1>
      <p className="text-gray-900 mb-12 mt-2">
        Manage books, students, and borrowings with ease.
      </p>

      {/* Navigation buttons */}
      <div className="flex gap-4 w-full max-w-md">
        <a
          href="/books"
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Books
        </a>
        <a
          href="/students"
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Students
        </a>
        <a
          href="/borrowings"
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Borrowings
        </a>
      </div>
       {/* Logo */}
      <img
        src="\books.png"
        alt="Library logo"
        className="mt-2 w-64 sm:w-72 md:w-80 xl:w-68 2xl:w-[410px] h-auto"
      />
    </div>
  );
}

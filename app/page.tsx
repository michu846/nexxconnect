import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-800/50 border border-slate-700 shadow-xl backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          NexxConnect
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          Your digital profile & business card management hub.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/admin"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
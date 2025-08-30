// import React, { useState } from "react";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// export default function App() {
//   const [prompt, setPrompt] = useState("");
//   const [size, setSize] = useState("1024x1024");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [result, setResult] = useState(null); // { id, imageUrl }

//   const [shareOpen, setShareOpen] = useState(false);
//   const [to, setTo] = useState("");
//   const [subject, setSubject] = useState("AI Meeting Image");
//   const [message, setMessage] = useState("Here's the generated meeting image.");

//   async function generate() {
//     setError("");
//     if (!prompt.trim()) {
//       setError("Please enter a prompt.");
//       return;
//     }
//     setLoading(true);
//     setResult(null);
//     try {
//       const res = await fetch(`${API_URL}/api/generate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt, size })
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to generate image");
//       setResult(data);
//       setMessage(`Here's the generated meeting image.\n${data.imageUrl}`);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function share() {
//     setError("");
//     if (!result?.id) {
//       setError("Please generate an image first.");
//       return;
//     }
//     if (!to.trim()) {
//       setError("Please enter at least one recipient email.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/share`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: result.id,
//           to,
//           subject,
//           message: message.replace(/\n/g, "<br/>")
//         })
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to share image");
//       alert(`Shared successfully to: ${data.recipients.join(", ")}`);
//       setShareOpen(false);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen">
//       <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
//           <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold">AI</div>
//           <h1 className="text-xl font-semibold">Meeting Image Generator</h1>
//           <div className="ml-auto text-xs text-gray-500">
//             API: <code>{API_URL}</code>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
//         <section className="space-y-3">
//           <label className="block text-sm font-medium">Prompt</label>
//           <textarea
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             rows={8}
//             placeholder="e.g., A clean, minimal poster for a product kickoff meeting, with a conference table, notebook, and soft natural lighting"
//             className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">Size</label>
//               <select
//                 value={size}
//                 onChange={(e) => setSize(e.target.value)}
//                 className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 p-2"
//               >
//                 <option>512x512</option>
//                 <option>768x768</option>
//                 <option>1024x1024</option>
//               </select>
//             </div>
//           </div>

//           {error && (
//             <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
//           )}

//           <button
//             onClick={generate}
//             disabled={loading}
//             className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-3 font-medium shadow"
//           >
//             {loading ? (
//               <span className="inline-flex items-center gap-2">
//                 <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
//                 Generating...
//               </span>
//             ) : (
//               "Generate Image"
//             )}
//           </button>
//         </section>

//         <section className="space-y-3">
//           <h2 className="text-sm font-medium">Preview</h2>
//           <div className="aspect-square rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-white/40 dark:bg-gray-800/50">
//             {result?.imageUrl ? (
//               <img src={result.imageUrl} alt="Generated" className="w-full h-full object-contain" />
//             ) : (
//               <div className="text-gray-400 text-sm">Your generated image will appear here</div>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <a
//               href={result?.imageUrl || "#"}
//               download={result ? `meeting-image-${result.id}.png` : undefined}
//               className={`rounded-2xl border px-4 py-2 ${result ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" : "opacity-60 cursor-not-allowed"} `}
//               onClick={(e) => { if (!result) e.preventDefault(); }}
//             >
//               Download PNG
//             </a>

//             <button
//               onClick={() => setShareOpen(true)}
//               disabled={!result}
//               className="rounded-2xl border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-60"
//             >
//               Share via Email
//             </button>

//             {result?.imageUrl && (
//               <button
//                 onClick={() => { navigator.clipboard.writeText(result.imageUrl); alert("Link copied!"); }}
//                 className="rounded-2xl border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 Copy Link
//               </button>
//             )}
//           </div>
//         </section>
//       </main>

//       {shareOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//           <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 space-y-3">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Share Image</h3>
//               <button onClick={() => setShareOpen(false)} className="text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Close</button>
//             </div>
//             <label className="block text-sm font-medium">Recipients (comma-separated)</label>
//             <input
//               type="text"
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               placeholder="alice@example.com, bob@example.com"
//               className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 p-2"
//             />
//             <label className="block text-sm font-medium">Subject</label>
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 p-2"
//             />
//             <label className="block text-sm font-medium">Message</label>
//             <textarea
//               rows={6}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/70 p-2"
//             />
//             <div className="flex gap-3 justify-end">
//               <button onClick={() => setShareOpen(false)} className="rounded-2xl border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</button>
//               <button
//                 onClick={share}
//                 disabled={!to.trim()}
//                 className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-500">
//         <p>Tip: Make your prompt specific, e.g. "Minimal poster for a Monday all-hands meeting, soft light, warm palette, office setting, 4k".</p>
//       </footer>
//     </div>
//   );
// }

import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { id, imageUrl }

  const [shareOpen, setShareOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("AI Meeting Image");
  const [message, setMessage] = useState("Here's the generated meeting image.");

  async function generate() {
    setError("");
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate image");
      setResult(data);
      setMessage(`Here's the generated meeting image.\n${data.imageUrl}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function share() {
    setError("");
    if (!result?.id) {
      setError("Please generate an image first.");
      return;
    }
    if (!to.trim()) {
      setError("Please enter at least one recipient email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: result.id,
          to,
          subject,
          message: message.replace(/\n/g, "<br/>"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || data.details || "Failed to generate image"
        );
      }

      alert(`Shared successfully to: ${data.recipients.join(", ")}`);
      setShareOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/10 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Meeting Image Generator
          </h1>
          <div className="ml-auto text-xs text-gray-300">
            API: <code>{API_URL}</code>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
        {/* Left Panel */}
        <section className="space-y-4 bg-white/10 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/10">
          <label className="block text-sm font-medium text-purple-300">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="e.g., A clean, minimal poster for a product kickoff meeting..."
            className="w-full rounded-xl border border-white/20 bg-black/30 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/30 p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>512x512</option>
              <option>768x768</option>
              <option>1024x1024</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-60 text-white px-5 py-3 font-medium shadow-lg transition"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Generating...
              </span>
            ) : (
              "Generate Image"
            )}
          </button>
        </section>

        {/* Right Panel */}
        <section className="space-y-4 bg-white/10 backdrop-blur rounded-2xl p-6 shadow-lg border border-white/10">
          <h2 className="text-sm font-medium text-purple-300">Preview</h2>
          <div className="aspect-square rounded-xl border border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-black/30">
            {result?.imageUrl ? (
              <img
                src={result.imageUrl}
                alt="Generated"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-sm">
                Your generated image will appear here
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={result?.imageUrl || "#"}
              download={result ? `meeting-image-${result.id}.png` : undefined}
              className={`rounded-xl border border-white/20 px-4 py-2 ${
                result
                  ? "hover:bg-white/10 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              } `}
              onClick={(e) => {
                if (!result) e.preventDefault();
              }}
            >
              Download PNG
            </a>

            <button
              onClick={() => setShareOpen(true)}
              disabled={!result}
              className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 disabled:opacity-60"
            >
              Share via Email
            </button>

            {result?.imageUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.imageUrl);
                  alert("Link copied!");
                }}
                className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10"
              >
                Copy Link
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Share Modal */}
      {shareOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-black/80 backdrop-blur border border-white/10 p-6 space-y-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Share Image</h3>
              <button
                onClick={() => setShareOpen(false)}
                className="text-sm px-3 py-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <label className="block text-sm font-medium">Recipients</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              className="w-full rounded-xl border border-white/20 bg-black/40 p-2"
            />

            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/40 p-2"
            />

            <label className="block text-sm font-medium">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/40 p-2"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShareOpen(false)}
                className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={share}
                disabled={!to.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 disabled:opacity-60 text-white px-4 py-2"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-400 text-center">
        <p>
          💡 Tip: Make your prompt specific, e.g. "Minimal poster for a Monday
          all-hands meeting, soft light, warm palette, office setting, 4k".
        </p>
      </footer>
    </div>
  );
}


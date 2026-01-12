import { useEffect, useState } from "react";

const API_URL = "http://localhost:5112";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const res = await fetch(`${API_URL}/notes`);
    const data = await res.json();
    setNotes(data);
  }

  async function createNote(e) {
    e.preventDefault();

    await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    fetchNotes();
  }

  async function deleteNote(id) {
    await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
    });

    fetchNotes();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Notes App
        </h1>

        {/* Note form */}
        <form onSubmit={createNote} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
            Add Note
          </button>
        </form>

        {/* Notes list */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-indigo-50 rounded-xl p-4 shadow-md hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg text-indigo-700">{note.title}</h3>
              <p className="text-gray-700 mt-2">{note.content}</p>
              <button
                onClick={() => deleteNote(note.id)}
                className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

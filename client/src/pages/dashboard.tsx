import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import instance from "../shared/axios";
import { apiConstants } from "../constant/apiConstant";
import { toast } from "react-toastify";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");

  const fetchNotes = async () => {
    try {
      const response = await instance.get(`/api/note`);
      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/signin");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    try {
      const response = await instance.post(`/api/note`, {
        title: newNoteTitle,
      });

      if (response.status === apiConstants.success) {
        setNewNoteTitle("");
        fetchNotes();
        toast.success(response.data?.message);
        setModalOpen(false);
      }
    } catch (err) {
      setError("Failed to create note.");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await instance.delete(`/api/note/${noteId}`);
      if (response.status === apiConstants.success) {
        toast.success(response.data?.message);
        fetchNotes();
      }
    } catch (err) {
      setError("Failed to delete note.");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("notesapp_token");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <img src={logo} alt="Logo" />
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <button
          className="text-blue-500 hover:underline"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>

      <div className="w-full max-w-md lg:max-w-lg bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800">
          Welcome, <span className="font-bold capitalize">{user.name}</span>!
        </h2>
        <p className="text-sm text-gray-500">Email: {user.email}</p>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="w-full max-w-md lg:max-w-lg bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg shadow-md mb-6"
      >
        Create Note
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Create a New Note
            </h3>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-4"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Enter note title"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createNote}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center w-full max-w-md lg:max-w-lg h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md lg:max-w-lg bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="w-full max-w-md lg:max-w-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>
        <div className="space-y-4">
          {notes.length > 0
            ? notes.map((note: any) => (
                <div
                  key={note._id}
                  className="flex justify-between items-center bg-white shadow-2xl rounded-lg p-4"
                >
                  <p className="text-gray-800">{note.title}</p>
                  <button onClick={() => deleteNote(note._id)} className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              ))
            : !loading && <p className="text-gray-500">No notes available.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

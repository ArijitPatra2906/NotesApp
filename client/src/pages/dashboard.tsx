import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import instance from "../shared/axios";
import { apiConstants } from "../constant/apiConstant";
import { toast } from "react-toastify";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Note title is required"),
});

const Dashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null); // Store the note ID to delete
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchNotes = async () => {
    setLoading(true);
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

  const createNote = async (values: { title: string }) => {
    setIsSubmitting(true);
    try {
      const response = await instance.post(`/api/note`, {
        title: values.title,
      });

      if (response.status === apiConstants.success) {
        setModalOpen(false);
        fetchNotes();
        toast.success(response.data?.message);
      }
    } catch (err) {
      setError("Failed to create note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteNote = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);

    try {
      const response = await instance.delete(`/api/note/${noteToDelete}`);
      if (response.status === apiConstants.success) {
        toast.success(response.data?.message);
        fetchNotes();
      }
    } catch (err) {
      setError("Failed to delete note.");
    } finally {
      setDeleteModalOpen(false);
      setNoteToDelete(null);
      setIsDeleting(false);
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
            <Formik
              initialValues={{ title: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                createNote(values);
                setSubmitting(false);
              }}
            >
              <Form>
                <div>
                  <Field
                    type="text"
                    name="title"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    placeholder="Enter note title"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="flex justify-between mt-5">
                  <button
                    onClick={() => setModalOpen(false)}
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-white"></div>
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Are you sure you want to delete this note?
            </h3>
            <div className="flex justify-between mt-5">
              <button
                onClick={() => setDeleteModalOpen(false)}
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteNote}
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-white"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading ? (
        <div className="w-full max-w-md lg:max-w-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>
          <div className="space-y-4">
            {notes.length > 0
              ? notes.map((note: any) => (
                  <div
                    key={note._id}
                    className="flex justify-between items-center shadow-2xl bg-white rounded-lg p-4"
                  >
                    <p className="text-gray-800">{note.title}</p>
                    <button
                      onClick={() => {
                        setNoteToDelete(note._id);
                        setDeleteModalOpen(true);
                      }}
                      className=""
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              : "No notes available."}
          </div>
        </div>
      ) : (
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
    </div>
  );
};

export default Dashboard;

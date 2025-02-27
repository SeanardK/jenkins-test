import { gql, useQuery, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import client from "@/lib/graphql";
import { Book } from "./api/books";

// GraphQL Queries & Mutations
const GET_BOOKS = gql`
  query Books($limit: Int, $offset: Int, $genre: String) {
    books(limit: $limit, offset: $offset, genre: $genre) {
      id
      title
      author
      publishedYear
      genre
      price
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $price: Float!
    $genre: String!
    $publishedYear: Int!
  ) {
    addBook(
      title: $title
      author: $author
      price: $price
      genre: $genre
      publishedYear: $publishedYear
    ) {
      id
      title
      author
      genre
      price
      publishedYear
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: Float!
    $title: String
    $author: String
    $price: Float
    $genre: String
    $publishedYear: Int
  ) {
    updateBook(
      id: $id
      title: $title
      author: $author
      price: $price
      genre: $genre
      publishedYear: $publishedYear
    ) {
      id
      title
      author
      genre
      price
      publishedYear
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Float!) {
    deleteBook(id: $id)
  }
`;

export default function Books() {
  const createModalRef = useRef<HTMLDialogElement>(null);

  const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
    client,
    variables: {
      limit: 6,
      offset: 1,
    },
  });
  const [addBook] = useMutation(ADD_BOOK, { client });
  const [updateBook] = useMutation(UPDATE_BOOK, { client });
  const [deleteBook] = useMutation(DELETE_BOOK, { client });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    publishedYear: "",
  });
  const [editBook, setEditBook] = useState<Book | null>(null);

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner"></span>
      </div>
    );

  if (error)
    return <p className="text-center text-red-500">Error loading books.</p>;

  const handleResetForm = () =>
    setFormData({
      title: "",
      author: "",
      genre: "",
      price: "",
      publishedYear: "",
    });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook({
      variables: {
        ...formData,
        price: parseFloat(formData.price),
        publishedYear: parseInt(formData.publishedYear),
      },
    });
    handleResetForm();
    refetch();

    createModalRef.current?.close();
  };

  const handleEditBook = (book: Book) => {
    setEditBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: book.price.toString(),
      publishedYear: book.publishedYear.toString(),
    });
    createModalRef.current?.showModal();
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook({
      variables: {
        id: editBook?.id,
        ...formData,
        price: parseFloat(formData.price),
        publishedYear: parseInt(formData.publishedYear),
      },
    });
    refetch();
    handleResetForm();
    createModalRef.current?.close();
  };

  const handleDeleteBook = async (id: number) => {
    await deleteBook({ variables: { id } });
    refetch();
  };

  return (
    <div className="p-10 bg-base-200 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center text-primary">
          📚 Book List
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            createModalRef.current?.showModal();
            handleResetForm();
          }}
        >
          Add Book
        </button>
      </div>

      {/* Book List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.books.map((book: Book) => (
          <div key={book.id} className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">{book.title}</h2>
              <p className="text-sm text-gray-500">{book.author}</p>
              <p className="badge badge-outline">{book.genre}</p>
              <p className="text-md mt-2">📅 Published: {book.publishedYear}</p>
              <p className="text-lg font-bold text-accent">
                💲 {book.price.toFixed(2)}
              </p>
              <div className="card-actions justify-end">
                <button
                  onClick={() => handleEditBook(book)}
                  className="btn btn-warning"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBook(book.id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Form */}
      <dialog id="create_modal" className="modal" ref={createModalRef}>
        <form
          onSubmit={editBook ? handleUpdateBook : handleAddBook}
          className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto"
        >
          <h2 className="text-xl font-semibold text-primary">
            {editBook ? "Edit Book" : "Add a New Book"}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input input-bordered w-full mt-2"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="input input-bordered w-full mt-2"
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value })
            }
            className="input input-bordered w-full mt-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="input input-bordered w-full mt-2"
            required
          />
          <input
            type="number"
            placeholder="Published Year"
            value={formData.publishedYear}
            onChange={(e) =>
              setFormData({ ...formData, publishedYear: e.target.value })
            }
            className="input input-bordered w-full mt-2"
            required
          />
          <button
            type="submit"
            className={`btn ${
              editBook ? "btn-warning" : "btn-primary"
            } w-full mt-4`}
          >
            {editBook ? "Update Book" : "Add Book"}
          </button>
          <button
            type="reset"
            onClick={() => createModalRef.current?.close()}
            className="btn btn-neutral w-full mt-4"
          >
            Cancel
          </button>
        </form>
      </dialog>
    </div>
  );
}

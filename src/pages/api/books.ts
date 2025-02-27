import { books } from "@/datas/books";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

// Define GraphQL Schema
const typeDefs = `#graphql
  type Query {
    hello: String
    books(limit: Int, offset: Int, genre: String): [Book]
    book(id: Int): Book
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      price: Float!,
      genre: String!,
      publishedYear: Int!
    ): Book
    
    updateBook(
      id: Float,
      title: String,
      author: String,
      price: Float,
      genre: String,
      publishedYear: Int
    ): Book

    deleteBook(id: Float): Boolean
  }
  
  type Book {
    id: Float
    title: String!
    author: String!
    publishedYear: Int!
    genre: String!
    price: Float!
  }
`;

export interface Book {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
  price: number;
}

interface QueryArgs {
  id?: number;
  limit?: number;
  offset?: number;
  genre?: string;
}

interface MutationArgs extends QueryArgs {
  title?: string;
  author?: string;
  price?: number;
  genre?: string;
  publishedYear?: number;
}

// Define Resolvers
const resolvers = {
  Query: {
    hello: () => "Hello, World!",

    books: (_: unknown, { limit, offset, genre }: QueryArgs) => {
      let filteredBooks: Book[] = books;

      // Filter by genre if provided
      if (genre) {
        filteredBooks = filteredBooks.filter(
          (book) => book.genre.toLowerCase() === genre.toLowerCase()
        );
      }

      // Apply pagination
      return filteredBooks.slice(
        offset ?? 0,
        (offset ?? 0) + (limit ?? filteredBooks.length)
      );
    },

    book: (_: unknown, { id }: QueryArgs) =>
      books.find((book) => book.id === id),
  },

  Mutation: {
    addBook: (
      _: unknown,
      { title, author, price, genre, publishedYear }: MutationArgs
    ) => {
      const newBook: Book = {
        id: books.length + 1,
        title: title!,
        author: author!,
        price: price!,
        genre: genre!,
        publishedYear: publishedYear!,
      };
      books.push(newBook);
      return newBook;
    },

    updateBook: (
      _: unknown,
      { id, title, author, price, genre, publishedYear }: MutationArgs
    ) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex === -1) return null;

      // Update only non-undefined values
      books[bookIndex] = {
        ...books[bookIndex],
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(price !== undefined && { price }),
        ...(genre !== undefined && { genre }),
        ...(publishedYear !== undefined && { publishedYear }),
      };

      return books[bookIndex];
    },

    deleteBook: (_: unknown, { id }: QueryArgs) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex === -1) return false;

      books.splice(bookIndex, 1);
      return true;
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(server);

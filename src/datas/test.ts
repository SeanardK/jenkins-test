const resolvers = {
  Query: {
    hello: () => "Hello, World!",

    books: (_: unknown, { limit, offset, genre }: QueryArgs) => books,

    book: (_: unknown, { id }: QueryArgs) =>
      books.find((book) => book.id === id),
  },

  Mutation: {
    addBook: (
      _: unknown,
      { title, author, price, genre, publishedYear }: MutationArgs
    ) => {
      //  Flow add new Book
      return newBook;
    },

    updateBook: (
      _: unknown,
      { id, title, author, price, genre, publishedYear }: MutationArgs
    ) => {
      //  Flow update Book
      return newBook;
    },

    deleteBook: (_: unknown, { id }: QueryArgs) => {
      // Flow delete Book
      return true;
    },
  },
};

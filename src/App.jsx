import { Edit, NotebookText, Trash } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AddBook from "./components/modal/AddBook";
import { Input } from "./components/ui/input";
import EditBook from "./components/modal/EditBook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

function App() {
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [searchBook, setSearchBook] = useState("");

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [editedBook, setEditedBook] = useState({});

  const handleModalAdd = () => {
    setIsModalAddOpen(!isModalAddOpen);
  };

  const handleModalEdit = (bookData) => {
    setEditedBook(bookData);
    setIsModalEditOpen(!isModalEditOpen);
  };

  const handleDeleteBook = (id) => {
    Swal.fire({
      title: "Hapus Buku?",
      text: "Apakah anda yakin ingin menghapus buku?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/data_buku/${id}`)
          .then(() => {
            Swal.fire({
              title: "Buku Berhasil Dihapus",
              text: "Buku dihapus dari data",
              icon: "success",
              confirmButtonText: "OK",
            });
            getBooks();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const getBooks = () => {
    let apiUrl = "http://localhost:8000/data_buku";

    if (sortBy) {
      apiUrl += `?_sort=${sortBy}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBooks();
  }, [sortBy]);

  return (
    <div className="bg-gray-500 p-4">
      <div className="bg-white rounded-lg py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="flex items-center text-2xl font-bold gap-2">
            <NotebookText></NotebookText>
            Library Data
          </h1>
          <Button onClick={handleModalAdd}>Tambah Buku</Button>
        </div>
        <div className="flex gap-4 my-4">
          <Input
            className="w-full"
            placeholder="Cari (masukkan judul buku atau pengarang)"
            value={searchBook}
            onChange={(e) => setSearchBook(e.target.value)}
          />
          <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Urut Berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">None</SelectItem>
              <SelectItem value="judul">Judul</SelectItem>
              <SelectItem value="tahun">Tahun Terbit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Table>
            <TableHeader className="bg-gray-300">
              <TableRow className="text-lg">
                <TableHead>No.</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Pengarang</TableHead>
                <TableHead>Tahun Terbit</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead colSpan={2} className="text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books
                .filter(
                  (book) =>
                    book.judul
                      .toLowerCase()
                      .includes(searchBook.toLowerCase()) ||
                    book.pengarang
                      .toLowerCase()
                      .includes(searchBook.toLowerCase())
                )
                .map((book, index) => (
                  <TableRow key={index} className="text-base">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.judul}</TableCell>
                    <TableCell>{book.pengarang}</TableCell>
                    <TableCell>{book.tahun}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>
                      <Edit
                        className="mx-auto"
                        cursor={"pointer"}
                        onClick={() => handleModalEdit(book)}
                      ></Edit>
                    </TableCell>
                    <TableCell>
                      <Trash
                        className="mx-auto"
                        cursor={"pointer"}
                        onClick={() => handleDeleteBook(book.id)}
                      ></Trash>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalAddOpen && (
        <AddBook handleModalAdd={handleModalAdd} getBooks={getBooks} />
      )}

      {isModalEditOpen && (
        <EditBook
          handleModalEdit={handleModalEdit}
          getBooks={getBooks}
          editedBook={editedBook}
          setEditedBook={setEditedBook}
        />
      )}
    </div>
  );
}

export default App;

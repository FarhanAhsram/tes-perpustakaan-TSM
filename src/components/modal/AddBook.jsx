import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import * as Yup from "yup";
/* eslint-disable react/prop-types */

export default function AddBook({ handleModalAdd, getBooks }) {
  const Genres = ["Fantasi", "Horor", "Self-Help", "Sejarah", "Biografi"];

  const [form, setForm] = useState({
    id: "",
    judul: "",
    pengarang: "",
    tahun: "",
    genre: "",
  });
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object({
    id: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "ID tidak dapat memuat simbol")
      .test("unique", "ID harus unik", async function (value) {
        const response = await axios.get("http://localhost:8000/data_buku");
        const books = response.data;
        const isDuplicate = books.some((book) => book.id === value);
        return !isDuplicate;
      })
      .required("ID harus diisi"),
    judul: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "Judul tidak dapat memuat simbol")
      .required("Judul harus diisi"),
    pengarang: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "Pengarang tidak dapat memuat simbol")
      .required("Pengarang harus diisi"),
    tahun: Yup.number()
      .typeError("Tahun harus dalam bentuk angka")
      .required("Tahun harus diisi"),
    genre: Yup.string().required("Genre harus diisi"),
  });

  const handleCreateBookChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleCreateBookSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(form, { abortEarly: false });

      await axios.post("http://localhost:8000/data_buku", form);

      Swal.fire({
        title: "Berhasil Tambahkan Buku",
        text: "Buku tersimpan dalam data",
        icon: "success",
        confirmButtonText: "OK",
      });
      getBooks();
      handleModalAdd();
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-[#22252EAD] opacity-100 z-10">
      <div className="bg-[#FFFFFF] w-1/2 rounded-2xl p-7 max-md:w-3/4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">Tambah Buku</h1>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            cursor={"pointer"}
            onClick={handleModalAdd}
          >
            <path
              d="M12.657 1.34333L1.34326 12.657M12.657 12.657L1.34326 1.34326"
              stroke="#26355D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <hr className="border-2 border-[#EDEEEF] my-4" />

        <div>
          <form action="" onSubmit={handleCreateBookSubmit}>
            <div className="mb-4">
              <Label htmlFor="id">
                ID Buku <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="id"
                name="id"
                className="mt-2"
                placeholder="ID Buku"
                value={form.id}
                onChange={handleCreateBookChange}
              />
              {errors.id && <p className="text-red-500">{errors.id}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="judul">
                Judul Buku <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="judul"
                name="judul"
                className="mt-2"
                placeholder="Judul Buku"
                value={form.judul}
                onChange={handleCreateBookChange}
              />
              {errors.judul && <p className="text-red-500">{errors.judul}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="pengarang">
                Pengarang <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="pengarang"
                name="pengarang"
                className="mt-2"
                placeholder="Pengarang"
                value={form.pengarang}
                onChange={handleCreateBookChange}
              />
              {errors.pengarang && (
                <p className="text-red-500">{errors.pengarang}</p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="tahun">
                Tahun Terbit <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="tahun"
                name="tahun"
                className="mt-2"
                placeholder="Tahun Terbit"
                value={form.tahun}
                onChange={handleCreateBookChange}
              />
              {errors.tahun && <p className="text-red-500">{errors.tahun}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="genre">
                Genre <span className="text-red-500">*</span>
              </Label>
              <Select
                id="genre"
                name="genre"
                className="mt-2"
                onValueChange={(value) => {
                  setForm({ ...form, genre: value });
                  setErrors({ ...errors, genre: "" });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  {Genres.map((genre, index) => (
                    <SelectItem key={index} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genre && <p className="text-red-500">{errors.genre}</p>}
            </div>
            <div className="flex justify-end gap-6">
              <Button type="submit">Tambah</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import * as Yup from "yup";
import { useState } from "react";
/* eslint-disable react/prop-types */

export default function EditBook({
  handleModalEdit,
  getBooks,
  editedBook,
  setEditedBook,
}) {
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object({
    id: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "ID must not contain symbols")
      .required("ID is required"),
    judul: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "Judul must not contain symbols")
      .required("Judul is required"),
    pengarang: Yup.string()
      .matches(/^[A-Za-z0-9\s]+$/, "Pengarang must not contain symbols")
      .required("Pengarang is required"),
    tahun: Yup.number()
      .typeError("Tahun must be a valid number")
      .required("Tahun is required"),
    genre: Yup.string().required("Genre is required"),
  });

  const handleEditBookChange = (e) => {
    const { name, value } = e.target;
    setEditedBook({
      ...editedBook,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleEditBookSubmit = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate(editedBook, { abortEarly: false });

      await axios.put(
        `http://localhost:8000/data_buku/${editedBook.id}`,
        editedBook
      );

      Swal.fire({
        title: "Book Updated Successfully",
        text: "The book has been updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      getBooks();
      handleModalEdit();
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
          <h1 className="font-bold text-2xl">Edit Book</h1>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            cursor={"pointer"}
            onClick={handleModalEdit}
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
          <form action="" onSubmit={handleEditBookSubmit}>
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
                value={editedBook.judul}
                onChange={handleEditBookChange}
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
                value={editedBook.pengarang}
                onChange={handleEditBookChange}
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
                value={editedBook.tahun}
                onChange={handleEditBookChange}
              />
              {errors.tahun && <p className="text-red-500">{errors.tahun}</p>}
            </div>
            <div className="mb-4">
              <Label htmlFor="genre">
                Genre <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => {
                  setEditedBook({ ...editedBook, genre: value });
                  setErrors({ ...errors, genre: "" });
                }}
              >
                <SelectTrigger className="w-full mt-2 mb-4">
                  <SelectValue placeholder={editedBook.genre} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Fiksi">Fiksi</SelectItem>
                    <SelectItem value="Non-Fiksi">Non-Fiksi</SelectItem>
                    <SelectItem value="Mitos">Mitos</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-6">
              <Button type="submit">Edit</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

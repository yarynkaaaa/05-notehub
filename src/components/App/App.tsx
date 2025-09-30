import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./App.module.css";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import {
  fetchNotes,
  createNote,
  deleteNote,
  type CreateNoteParams,
} from "../../services/noteService";
import { useDebounce } from "use-debounce";
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const queryClient = useQueryClient();
  const perPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: debouncedSearch,
      }),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      setCurrentPage(1);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateNote = (values: CreateNoteParams) => {
    createNoteMutation.mutate(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />
        {data && (
          <Pagination
            totalItems={data.total}
            itemsPerPage={perPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <p>Завантаження нотаток...</p>}
      {isError && <p>Помилка завантаження нотаток</p>}
      {data && data.items.length > 0 && (
        <NoteList notes={data.items} onDelete={handleDeleteNote} />
      )}
      {data && data.items.length === 0 && (
        <p>Нотаток не знайдено. Створіть нову нотатку!</p>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSubmit={handleCreateNote} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}

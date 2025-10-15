import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import { fetchNotes, createNote, type CreateNoteParams } from "../../services/noteService";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const queryClient = useQueryClient();
  const perPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes({ page: currentPage, perPage, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.totalPages !== undefined) {
      setPageCount(data.totalPages);
    }
  }, [data]);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      setCurrentPage(1);
    },
  });

  const notes = data?.items || [];

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />

        {pageCount > 1 && (
          <Pagination
            page={currentPage}
            setPage={handlePageChange}
            pageCount={pageCount}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Завантаження нотаток...</p>}
      {isError && <p>Помилка завантаження нотаток</p>}

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        !isLoading && <p>Нотаток не знайдено. Створіть нову нотатку!</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />

        </Modal>
      )}
    </div>
  );
}

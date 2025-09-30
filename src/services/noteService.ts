import axios, { type AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  items: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  id: string;
  message: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = "" } = params;

  const response: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page,
      perPage,
      ...(search && { search }),
    },
  });

  return response.data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await api.delete(
    `/notes/${id}`
  );
  return response.data;
};

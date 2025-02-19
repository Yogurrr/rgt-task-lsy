import { useEffect, useState } from "react";
import { supabase } from '@/utils/supabase';

interface Book {
    id: number;
    title: string;
    author: string;
    price: number | null;
    quantity: number | null;
}

const useBooks = (bookId?: number) => {
    const [books, setBooks] = useState<Book[] | null>([]);
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);

            if (bookId) {
                // 특정 ID에 해당하는 도서 가져오기
                const { data, error } = await supabase.from("books").select("*").eq("id", bookId).single();
                if (error) setError(error.message);
                else setBook(data);
            } else {
                // 전체 도서 목록 가져오기
                const { data, error } = await supabase.from("books").select("*");
                if (error) setError(error.message);
                else setBooks(data);
            }

            setLoading(false);
        };

        fetchBooks();
    }, [bookId]);
    
    return { book, books, loading, error };
}

export default useBooks;
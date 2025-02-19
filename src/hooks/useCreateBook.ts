import { supabase } from '@/utils/supabase';

export const useCreateBook = async (title: string, author: string, price: number, quantity: number) => {
    const { data, error } = await supabase
      .from('books')
      .insert([
        { title, author, price, quantity },
      ]);
      
  
    if (error) {
        console.error('도서 추가 에러:', error);
        return { success: false, error };
    }
  
    return { success: true, data };
};
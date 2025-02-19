import { supabase } from '@/utils/supabase';

export const useUpdateBook = () => {
  const updateBook = async (id: number, title: string, author: string, price: number, quantity: number) => {
    const { data, error } = await supabase
      .from('books')
      .update({ title, author, price, quantity })
      .eq('id', id)
      .single();

    if (error) {
      console.error('도서 수정 에러:', error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  return { updateBook };
};
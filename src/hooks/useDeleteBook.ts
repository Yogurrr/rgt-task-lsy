import { supabase } from '@/utils/supabase';

export const useDeleteBook = () => {
  const deleteBook = async(id: number) => {
    const { data, error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error deleting book:', error);
      return { success: false, error };
    }
  
    return { success: true, data };
  }
  
  return { deleteBook };
};
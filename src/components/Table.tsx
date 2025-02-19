import Link from 'next/link';
import { FC } from 'react';

interface TableProps {
  data: { id: number; title: string; author: string; }[];
}

const Table: FC<TableProps> = ({ data }) => {
  return (
    <table style={{ width: '60%', marginLeft: '20%', border: '1px solid black' }}>
        <thead>
            <tr>
                <th>도서명</th>
                <th>작가</th>
            </tr>
        </thead>
        <tbody>
            {data.map(book => (
                <tr key={book.id} style={{ textAlign: 'center' }}>
                  <td>
                    <Link href={`/booklist/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.author}</td>
                </tr>
            ))}
        </tbody>
    </table>
  );
};

export default Table;
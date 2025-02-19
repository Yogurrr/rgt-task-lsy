'use client';

import useBooks from '@/src/hooks/useBooks';
import { useDeleteBook } from '@/src/hooks/useDeleteBook';
import { useParams } from "next/navigation";
import Button from '@/src/components/Button';
import { useEffect, useState } from 'react';
import { useUpdateBook } from '@/src/hooks/useUpdateBook';

interface Book {
    id: number;
    title: string;
    author: string;
    price: number | null;
    quantity: number | null;
}

const BookDetails = () => {
    const params = useParams();
    const id = params.id;

    const bookId = id ? parseInt(id as string, 10) : undefined;
    const { book, error } = useBooks(bookId);

    if (error) return <p>에러 발생: {error}</p>;

    // 삭제 버튼
    const [isDeleted, setIsDeleted] = useState(false);
    const { deleteBook } = useDeleteBook();
    const deleteBtn = async (id: number) => {
        const result = await deleteBook(id);
        if(result.success) {
            setIsDeleted(true);
            alert('책이 삭제되었습니다.');
            location.href = '/booklist';
        } else {
            alert('책 삭제에 실패했습니다.');
        }
    };

    // 목록으로 돌아가기 버튼
    const go2list = () => {
        location.href = '/booklist';
    };

    // 수정
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(book?.title);
    const [updatedAuthor, setUpdatedAuthor] = useState(book?.author);
    const [updatedPrice, setUpdatedPrice] = useState(book?.price);
    const [updatedQuantity, setUpdatedQuantity] = useState(book?.quantity);

    // input의 value를 book으로 초기화
    useEffect(() => {
        if (book) {
            setUpdatedTitle(book.title);
            setUpdatedAuthor(book.author);
            setUpdatedPrice(book.price);
            setUpdatedQuantity(book.quantity);
        }
    }, [book]);

    // 수정 버튼 클릭 시 폼으로 전환
    const toggleEdit = () => {
        setIsEditing(true);
    };

    // 수정 완료 시 서버로 데이터 전송
    const { updateBook } = useUpdateBook();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!updatedTitle || !updatedAuthor || !updatedPrice || !updatedQuantity) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        const { data, error } = await updateBook(Number(id), updatedTitle ?? "", updatedAuthor ?? "", Number(updatedPrice), Number(updatedQuantity));

        if (error) {
            alert('책 정보를 수정하는데 실패했습니다: ' + error.message);
        } else {
            alert('책 정보가 성공적으로 수정되었습니다!')
            window.location.reload();
        }
    };

    const updateBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleSubmit(e as any);
    }

    // 수정 취소
    const cancelUpdateBtn = () => {
        setIsEditing(false);
    }

    return(
        <>
            {!isEditing && book ? (
                <div>
                    <table style={{ marginTop: '2%', marginLeft: '30%', width: '40%', border: '1px solid black', textAlign: 'center' }}>
                        <tbody>
                            <tr>
                                <th>제목</th>
                                <td>{book?.title}</td>
                            </tr>
                            <tr>
                                <th>작가</th>
                                <td>{book?.author}</td>
                            </tr>
                            <tr>
                                <th>가격</th>
                                <td>{book?.price}</td>
                            </tr>
                            <tr>
                                <th>수량</th>
                                <td>{book?.quantity}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ textAlign: 'center', marginTop: '1%' }}>
                        <Button name="수정" onClick={toggleEdit}></Button>
                        <Button name="삭제" onClick={() => { if (book) { deleteBtn(book.id) } } }></Button>
                        <Button name="목록으로 돌아가기" onClick={go2list}></Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <table style={{ marginTop: '2%', marginLeft: '30%', width: '40%', border: '1px solid black', textAlign: 'center' }}>
                        <tbody>
                            <tr>
                                <th>제목</th>
                                <td><input type='text' value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)}></input></td>
                            </tr>
                            <tr>
                                <th>작가</th>
                                <td><input type='text' value={updatedAuthor} onChange={(e) => setUpdatedAuthor(e.target.value)}></input></td>
                            </tr>
                            <tr>
                                <th>가격</th>
                                <td><input type='text' value={updatedPrice || ''} onChange={(e) => setUpdatedPrice(parseFloat(e.target.value))}></input></td>
                            </tr>
                            <tr>
                                <th>수량</th>
                                <td><input type='number' value={updatedQuantity || ''} onChange={(e) => setUpdatedQuantity(parseInt(e.target.value))}></input></td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ textAlign: 'center', marginTop: '1%' }}>
                        <Button name="완료" onClick={updateBtn}></Button>
                        <Button name="취소" onClick={cancelUpdateBtn}></Button>
                        <Button name="목록으로 돌아가기" onClick={go2list}></Button>
                    </div>
                </form>
            )}
        </>
    );
}

export default BookDetails;
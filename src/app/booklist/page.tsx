'use client';

import { FC, useState, useEffect } from 'react';
import Table from '@/src/components/Table';
import useBooks from '@/src/hooks/useBooks';
import Button from '@/src/components/Button';
import AddBookModal from '@/src/components/AddBookModal';
import '@/src/styles/AddBookModal.css';
import { useCreateBook } from '@/src/hooks/useCreateBook';

const Booklist: FC = () => {
    const { books, error } = useBooks();

    if (error) return <p>에러 발생: {error}</p>;
    
    // 테이블
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;

    const currentData = books?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = books ? Math.ceil(books.length / rowsPerPage) : 0;

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 모달 띄우기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 도서 추가
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [message, setMessage] = useState('');
    const createBook = useCreateBook();

    const addBook = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !author || !price || !quantity) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        const { data, error } = await createBook(title, author, Number(price), Number(quantity));

        if (error) {
            alert('책을 추가하는데 실패했습니다: ' + error.message);
            setIsModalOpen(false);
        } else {
            alert('책이 성공적으로 추가되었습니다!')
            setTitle('');
            setAuthor('');
            setPrice('');
            setQuantity('');
            setIsModalOpen(false);
            window.location.reload();
        }
    };
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        addBook(new Event("submit") as React.FormEvent<HTMLFormElement>); // 강제 변환
    };

    return(
        <>
            <div style={{ paddingLeft: '74%' }}>
                <Button name='도서 추가' onClick={openModal}></Button>
            </div>
            <div style={{ textAlign: 'center' }}>검색 부분</div>
            <Table data={currentData ?? []}></Table>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1%' }}>
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    style={{ padding: '8px 16px', margin: '0 8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                    &lt;
                </button>

                <span>{currentPage} / {totalPages}</span>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    style={{ padding: '8px 16px', margin: '0 8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    &gt;
                </button>
            </div>

            {/* 모달 부분 */}
            <AddBookModal isOpen={isModalOpen} onConfirm={handleClick} onClose={closeModal} title="도서 추가">
                <form>
                    <table style={{ marginLeft: '10%' }}>
                        <tbody>
                            <tr>
                                <td className='inputName'>도서명</td>
                                <td><input type='text' className='bookInput' value={title} onChange={(e) => setTitle(e.target.value)} required></input></td>
                            </tr>
                            <tr>
                                <td className='inputName'>작가</td>
                                <td><input type='text' className='bookInput' value={author} onChange={(e) => setAuthor(e.target.value)} required></input></td>
                            </tr>
                            <tr>
                                <td className='inputName'>가격</td>
                                <td><input type='text' className='bookInput' value={price} onChange={(e) => setPrice(e.target.value)} required></input></td>
                            </tr>
                            <tr>
                                <td className='inputName'>수량</td>
                                <td><input type='number' className='bookInput' value={quantity} onChange={(e) => setQuantity(e.target.value)} required></input></td>
                            </tr>
                            <style jsx>
                                {`
                                    .inputName {
                                        font-size: 20px;
                                    }

                                    .bookInput {
                                        border: 1px solid black;
                                        border-radius: 5px;
                                        width: 300px;
                                        height: 25px;
                                        margin-left: 2%;
                                    }
                                `}
                            </style>
                        </tbody>
                    </table>
                </form>
            </AddBookModal>
        </>
    );
}

export default Booklist;
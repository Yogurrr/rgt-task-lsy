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
    const createBook = useCreateBook();
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(books);

    // 타입 지정
    type SelectOption = 'title' | 'author';
    const [selectOption, setSelectOption] = useState<SelectOption>('title');

    useEffect(() => {
        handleSearch();
    }, [keyword, selectOption]);

    useEffect(() => {
        if (books) {
            setFilteredBooks(books);
        }
    }, [books]);

    if (error) return <p>에러 발생: {error}</p>;

    // 필터링 함수
    const handleSearch = () => {
        if (!keyword) {
            setFilteredBooks(books); // 검색어가 없으면 전체 목록을 표시
        } else {
            const filtered = books?.filter((book) => {
                const targetValue = book[selectOption].toLowerCase();
                return targetValue.includes(keyword.toLowerCase());
            });
            setFilteredBooks(filtered ?? []);
        }
    };
    
    // 페이지네이션
    const rowsPerPage = 10;
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;

    const currentData = filteredBooks?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = filteredBooks ? Math.ceil(filteredBooks.length / rowsPerPage) : 0;

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
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 도서 추가
    const addBook = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !author || !price || !quantity) {
            alert('모든 항목을 입력해주세요.');
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

    // select option 처리
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectOption(event.target.value as SelectOption);
    };

    return(
        <>
            <div style={{ paddingLeft: '74%' }}>
                <Button name='도서 추가' onClick={openModal}></Button>
            </div>
            <div style={{ margin: '1% 0 1% 20%' }}>
                <select style={{ marginRight: '1%' }} value={selectOption} onChange={handleSelect}>
                    <option value="title">제목</option>
                    <option value="author">저자</option>
                </select>
                <input
                    type="text"
                    placeholder="검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ width: '69%', height: '35px', marginRight: '1%', borderRadius: '5px' }}
                />
            </div>
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
            <AddBookModal isOpen={isModalOpen} onConfirm={addBook} onClose={closeModal} title="도서 추가">
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
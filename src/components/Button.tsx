import { FC } from 'react';

interface ButtonProps {
    name: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: FC<ButtonProps> = ({ name, onClick }) => {
    return(
        <button 
        onClick={onClick}
        style={{ padding: '3px 8px 3px 8px', fontWeight: 'bold', 
        backgroundColor: 'mediumslateblue', border: 'none', 
        borderRadius: '5px', margin: '4px' }}>
            {name}
        </button>
    );
};

export default Button;
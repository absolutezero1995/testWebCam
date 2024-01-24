import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import './Table.css';
import Modal from "../modal/Modal";

type Category = {
    title: string,
    Questions: [],
}

type Question = {
    rate: number,
    question: string,
    answer: string,
}

const Table = () => {
    const [state, setState] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/questions', {
                    credentials: "include"
                });
                const data = await response.json();
                setState(data);
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="table__containter">
            {state.map((category: Category) => (
                <div key={uuidv4()} className="category__container">
                    <div className="category__item">{category.title}</div>
                    {category.Questions.map((question: Question) => (
                        <div
                            onClick={() => setSelectedQuestion(question)}
                            key={uuidv4()}
                            className="category__item"
                        >
                            {question.rate}
                        </div>
                    ))}
                </div>
            ))}
            {selectedQuestion && (
                <Modal
                    isOpen={true}
                    onClose={() => setSelectedQuestion(null)}
                    question={selectedQuestion} 
                />
            )}
        </div>
    );
}

export default Table;

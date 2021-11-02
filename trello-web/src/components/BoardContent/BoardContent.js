import React, {useState, useEffect} from 'react';
import { isEmpty } from 'lodash';

import './BoardContent.scss';
import {initialData}  from 'actions/initialData';
import {mapOrder}  from 'utilities/sorts';
import Column from 'components/Column/Column';

function BoardContent() {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === "board-1")
        if (boardFromDB) {
            setBoard(boardFromDB)

            //thứ tự columns tuân theo thuộc tính columnOrder
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
        }

    }, [])

    if (isEmpty(board)){
        return (
            <div className="not-found" style={{'padding': '10px', 'color': 'white'}}>
                Board not found
            </div>
        )
    }

    return (
        <div className="board-content">
            {columns.map(column => <Column key={column.id} column={column} />)}
        </div>
    )
}

export default BoardContent;
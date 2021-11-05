import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'

import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import Column from 'components/Column/Column'

function BoardContent() {
  const [board, setBoard] = useState({ columnOrder: [], columns: [] })
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      //thứ tự columns tuân theo thuộc tính columnOrder
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }

  }, [])

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>
        Board not found
      </div>
    )
  }

  const onColumnDrop = (dropResult) => {
    // Tạo bản sao
    let newColumns = [...columns]
    // Sắp xếp thứ tự các columns lại theo dropResult
    newColumns = applyDrag(newColumns, dropResult)

    // Tạo bản sao
    let newBoard = { ...board }
    // Sắp xếp lại columnOrder theo thứ tự của newColumns
    newBoard.columnOrder = newColumns.map(column => column.id)
    // Gán lại các columns theo thứ tự mới
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.addedIndex != null || dropResult.removedIndex != null) {
      // Tạo bản sao
      let newColumns = [ ...columns ]
      // Lấy ra column có id đúng bằng columnId
      let currentColumn = newColumns.find(c => c.id === columnId)
      // Sắp xếp lại các cards trong currentColumn theo dropResult
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      // Gán lại cardOrder theo danh sách các CardId hiện tại
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
    }
  }

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map(column => (
          <Draggable key={column.id}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon"/> Add another column
      </div>
    </div>
  )
}

export default BoardContent
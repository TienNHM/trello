import React, { useState, useEffect, useRef } from 'react'
import { isEmpty } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'

import './BoardContent.scss'
import { initialData } from 'actions/initialData'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/dragDrop'
import Column from 'components/Column/Column'

function BoardContent() {
  const [board, setBoard] = useState({ })
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const newColumnInputRef = useRef(null)

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      //thứ tự columns tuân theo thuộc tính columnOrder
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }

  }, [])

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm])

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
      let newColumns = [...columns]
      // Lấy ra column có id đúng bằng columnId
      let currentColumn = newColumns.find(c => c.id === columnId)
      // Sắp xếp lại các cards trong currentColumn theo dropResult
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      // Gán lại cardOrder theo danh sách các CardId hiện tại
      currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

      setColumns(newColumns)
    }
  }

  const addNewColumn = () => {
    if (!newColumnTitle)
    {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), // 5 random charecters
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    // Tạo bản sao
    let newColumns = [...columns]
    // Thêm column mới vào cuối
    newColumns.push(newColumnToAdd)
    // Tạo bản sao
    let newBoard = { ...board }
    // Sắp xếp lại columnOrder theo thứ tự của newColumns
    newBoard.columnOrder = newColumns.map(column => column.id)
    // Gán lại các columns theo thứ tự mới
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
    setNewColumnTitle('')
    setOpenNewColumnForm(false)
  }

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const onNewColumnTitleChange = (event) => setNewColumnTitle(event.target.value)

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
      <BootstrapContainer className="bootstrap-container">
        {!openNewColumnForm &&
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon" /> Add another column
            </Col>
          </Row>
        }

        {openNewColumnForm &&
          <Row>
            <Col className="enter-new-column">
              <Form.Control size="sm" type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(event) => (event.key === 'Enter') && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>{' '}
              <span className="cancel-add-new-column" onClick={toggleOpenNewColumnForm}>
                <i className="fa fa-times icon"></i>
              </span>
            </Col>
          </Row>
        }
      </BootstrapContainer>
    </div>
  )
}

export default BoardContent
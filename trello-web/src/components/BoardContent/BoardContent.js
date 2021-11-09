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
  const emptyBoard = {
    id: '',
    title: '',
    columnOrder: [],
    columns: []
  }
  const [board, setBoard] = useState(emptyBoard)
  const [columns, setColumns] = useState([])
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const newColumnInputRef = useRef(null) // Lưu ref đến đối tượng text input nhập title cho column mới
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  /**
   * Dùng để thay đổi state openNewColumnForm xem có mở/đóng form nhập title cho column mới hay không.
   * @returns void
   */
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  // Load data
  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
    if (boardFromDB) {
      setBoard(boardFromDB)

      //thứ tự columns tuân theo thuộc tính columnOrder
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
    }

  }, [])

  // Được gọi mỗi khi dữ liệu lưu trong `openNewColumnForm` thay đổi
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

  /**
   * Xử lý sự kiện kéo thả column
   * @param {*} dropResult kết quả kéo thả
   */
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

  /**
   * Xử lý sự kiện kéo thả card
   * @param {*} columnId id của column hiện tại
   * @param {*} dropResult kết quả kéo thả
   */
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

  /**
   * Thêm mới 1 column vào board
   * - Nếu chưa nhập column title: focus và chọn tất cả text trong ô input title
   * - Nếu đã nhập title: tạo mới 1 column và thêm vào board
   */
  const addNewColumn = () => {
    // Nếu chưa nhập title thì để cho người dùng quay lại nhập title
    if (!newColumnTitle) {
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

    // Cập nhật state cho columns
    setColumns(newColumns)
    // Cập nhật state cho board
    setBoard(newBoard)
    // Gán lại title là ''
    setNewColumnTitle('')
    // Đóng form nhập title
    setOpenNewColumnForm(false)
  }

  /**
   * Cập nhật state cho newColumnTitle mỗi khi text ở ô input thay đổi
   * @param {*} event đối tượng lưu giá trị text hiện tại
   * @returns void
   */
  const onNewColumnTitleChange = (event) => setNewColumnTitle(event.target.value)

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(c => c.id === columnIdToUpdate)

    if (newColumnToUpdate._destroy) {
      // Remove column
      newColumns.splice(columnIndexToUpdate, 1)
    }
    else {
      // Updated
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    // Tạo bản sao
    let newBoard = { ...board }
    // Sắp xếp lại columnOrder theo thứ tự của newColumns
    newBoard.columnOrder = newColumns.map(column => column.id)
    // Gán lại các columns theo thứ tự mới
    newBoard.columns = newColumns

    // Cập nhật state cho columns
    setColumns(newColumns)
    // Cập nhật state cho board
    setBoard(newBoard)
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
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
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
                placeholder="Enter column title..." className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(event) => (event.key === 'Enter') && addNewColumn()} // Nếu nhấn Enter thì tạo mới column
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>{' '}
              <span className="cancel-icon" onClick={toggleOpenNewColumnForm}>
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
import React, { useState, useEffect, useRef } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import { cloneDeep } from 'lodash'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { selectAllInLineText, saveContentAfterPressEnter } from 'utilities/contentEditable'

function Column({ column, onCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewColumnTitleChange = (event) => setNewCardTitle(event.target.value)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  /**
   * Dùng để thay đổi state openNewColumnForm xem có mở/đóng form nhập title cho column mới hay không.
   * @returns void
   */
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [columnTitle, setColumnTitle] = useState('')

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  const newCardTextareaRef = useRef(null)
  // Được gọi mỗi khi dữ liệu lưu trong `openNewColumnForm` thay đổi
  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()
    }
  }, [openNewCardForm])

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColum = {
        ...column,
        _destroy: true
      }
      onUpdateColumn(newColum)
    }

    toggleShowConfirmModal()
  }

  const handleColumnTitleBlur = () => {
    const newColum = {
      ...column,
      title: columnTitle
    }
    onUpdateColumn(newColum)
  }

  const handleColumnTitleChange = (event) => {
    setColumnTitle(event.target.value)
  }

  const addNewCard = () => {
    // Nếu chưa nhập title thì để cho người dùng quay lại nhập title
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()
      return
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5), // 5 random charecters
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cardOrder: [],
      cards: []
    }

    // Tạo bản sao
    let newColumn = cloneDeep(column)
    // Thêm card mới vào cuối
    newColumn.cards.push(newCardToAdd)
    // Sắp xếp lại columnOrder theo thứ tự của newColumn
    newColumn.cardOrder.push(newCardToAdd.id)

    onUpdateColumn(newColumn)
    setNewCardTitle('')
    toggleOpenNewCardForm(false)
  }

  return (
    <div className="column bootstrap-container">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control size="sm" type="text"
            placeholder="Enter column title..."
            className="content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInLineText}
            onMouseDown={e => e.preventDefault()}
            onBlur={handleColumnTitleBlur}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column</Dropdown.Item>
              <Dropdown.Item>Move all card in this column (beta)</Dropdown.Item>
              <Dropdown.Item>Archive all card in this column (beta)</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="trello-columns"
          orientation="vertical" // default
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map(card => (
            <Draggable key={card.id}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm &&
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card..."
              className="textarea-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewColumnTitleChange}
              onKeyDown={(event) => (event.key === 'Enter') && addNewCard()} // Nếu nhấn Enter thì tạo mới column
            />
          </div>
        }
      </div>
      <footer>
        {openNewCardForm &&
          <div className="add-new-card-actions" onClick={addNewCard}>
            <Button variant="success" size="sm">Add column</Button>{' '}
            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-times icon"></i>
            </span>
          </div>
        }

        {!openNewCardForm &&
          <div className="footer-actions" onClick={toggleOpenNewCardForm}>
            <i className="fa fa-plus icon" /> Add another card
          </div>
        }
      </footer>

      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>! All relative cards will also be removed!`}
      >
      </ConfirmModal>
    </div>
  )
}

export default Column
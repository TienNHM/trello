import React, { useState, useEffect } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'
import './Column.scss'
import { mapOrder } from 'utilities/sorts'
import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { selectAllInLineText, saveContentAfterPressEnter } from 'utilities/contentEditable'

function Column({ column, onCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

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

  return (
    <div className="column">
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
              <Dropdown.Item>Add card</Dropdown.Item>
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
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" /> Add another card
        </div>
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
import React from 'react';

import './Column.scss'
import { mapOrder } from 'utilities/sorts';
import Card from 'components/Card/Card'

function Column({column}) {
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    return (
        <div className="column">
            <header>{column.title}</header>
            <ul className="card-list">
                {cards.map(card => <Card key={card.id} card={card} />)}
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}

export default Column;
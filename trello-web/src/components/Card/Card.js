import React from 'react';
import './Card.scss'

function Card({card}) {
    return (
        <li className="card-item">
            {card.cover && <img className="card-cover" src={card.cover} alt={card.title} />}
            {card.title}
        </li>
    )
}

export default Card;
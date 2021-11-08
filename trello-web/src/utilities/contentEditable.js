export const saveContentAfterPressEnter = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    event.target.blur()
  }
}

export const selectAllInLineText = (event) => {
  event.target.focus()
  event.target.select()
}
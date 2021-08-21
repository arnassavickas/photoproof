export const makeId = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let number = 0; number < length; number += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

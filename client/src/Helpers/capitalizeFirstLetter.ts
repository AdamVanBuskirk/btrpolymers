
/* We can extend to handle multiple words in a sentence later if needed */
export const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
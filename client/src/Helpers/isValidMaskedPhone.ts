export const isValidMaskedPhone = (phone: string) => {
    /* validates that there are 10 digits and in the format
       of (999) 999-9999 
    */
    let isValidPhone = 
        typeof phone === "string" &&
        /^\(\d{3}\) \d{3}-\d{4}$/.test(phone) &&
        phone.replace(/\D/g, "").length === 10;
    return isValidPhone;
}

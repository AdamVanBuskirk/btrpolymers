
export const maskPhone = (phone: string) => {
    if (!phone) return "";
    return phone.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
}

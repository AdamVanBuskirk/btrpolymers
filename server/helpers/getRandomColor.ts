export interface IColor {
    hex: string,
    font: string,
}

export const colors: Array<IColor> = [
    { hex: "#F5B7B1", font: "#000" }, { hex: "#D2B4DE", font: "#000"  }, { hex: "#AED6F1", font: "#000"  }, { hex: "#A2D9CE", font: "#000" }, 
    { hex: "#EC7063", font: "#fff" }, { hex: "#A569BD", font: "#fff"  }, { hex: "#5DADE2", font: "#fff"  }, { hex: "#45B39D", font: "#fff" },
    { hex: "#A93226", font: "#fff" }, { hex: "#7D3C98", font: "#fff" }, { hex: "#2E86C1", font: "#fff" }, { hex: "#138D75", font: "#fff" },
    { hex: "#F9E79F", font: "#000" }, { hex: "#F5CBA7", font: "#000"  }, { hex: "#AEB6BF",  font: "#000"  }, { hex: "#ABEBC6", font: "#000" },
    { hex: "#F4D03F", font: "#fff" }, { hex: "#EB984E", font: "#fff" }, { hex: "#5D6D7E", font: "#fff"}, { hex: "#58D68D", font: "#fff" },
    { hex: "#D4AC0D", font: "#fff" }, { hex: "#CA6F1E", font: "#fff"}, { hex: "#2E4053", font: "#fff"}, { hex: "#28B463", font: "#fff" },

]

export const getRandomColor = (): IColor => {
    return colors[(Math.floor(Math.random() * colors.length))];
}



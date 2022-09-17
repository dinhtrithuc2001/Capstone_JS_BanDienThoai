function Service(){
    this.getListProduct = function(){
        return axios({
            url: "https://6323f57b5c1b4357279d8e42.mockapi.io/api/products",
            method: "GET"
        })
    }
}   
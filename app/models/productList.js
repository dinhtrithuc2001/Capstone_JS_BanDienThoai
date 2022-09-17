function ProductList(){
    this.array = [];

    this.timViTriTheoId = function(id){
        var index = -1;
        for(var i = 0; i < this.array.length; i++){
            if(id == this.array[i].id){
                index = i;
            }
        }
        return index;
    }

    this.laySanPham = function(id){
        var index = this.timViTriTheoId(id);
        if(index !== -1){
            return this.array[index];
        }
        return null;
    }
}
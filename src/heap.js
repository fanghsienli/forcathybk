var Heap = function(){
    this.list=[];
}

Heap.prototype.insert = function (node) {
    this.list.push(node);
    var k = this.list.length - 1;
    while (k>0) {
        var p = Math.floor((k - 1) / 2);
        if()
    }
}
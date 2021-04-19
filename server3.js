const express = require("express");

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 3200;
var cors = require('cors');

app.use(cors());

app.use(bodyparser.json());


app.listen(port, () => {
  console.log(`running at port ${port}`);
});


app.get('/ex1/huffman',(req,res) => {
	data=req.query.data
	
	let map;
class Node {  
    constructor(value, char, left, right) {  
        this.val  =value;   
        this.char  =char; 
        this.left = left;  
        this.right = right;  
    }  
}

class huffmanTree{  
    constructor(str){  
         
        let hash = {};  
        for(let i = 0; i < str.length; i++){  
            hash[str[i]] = ~~hash[str[i]] + 1;  
        }  
        this.hash = hash;    
        this.huffmanTree = this.getHuffmanTree();  
        map = this.getHuffmanCode(this.huffmanTree);  
        this.binaryStr = this.getBinaryStr(map, str);  
    }  

    getHuffmanTree(){  
        let forest = []  
        for(let char in this.hash){  
            let node = new Node(this.hash[char], char); 
            forest.push(node);  
        }   
        let allNodes = []; 
        while(forest.length !== 1){    
            forest.sort((a, b) => {  
                return a.val - b.val;  
            });  
  
            let node = new Node(forest[0].val + forest[1].val, '');  
            allNodes.push(forest[0]);  
            allNodes.push(forest[1]);  
            node.left  = allNodes[ allNodes.length  -2]; 
            node.right  = allNodes[ allNodes.length  -1]; 
            forest = forest.slice(2);    
            forest.push(node);  
        }  
  
    
        return forest[0];  
    }  
  
 
    getHuffmanCode(tree){  
        let hash = {}; 
        let traversal = (node, curPath) => {  
            if (!node.length && !node.right) return;  
            if (node.left && !node.left.left && !node.left.right){  
                hash[node.left.char] = curPath + '0';  
            }  
            if (node.right && !node.right.left && !node.right.right){  
                hash[node.right.char] = curPath + '1';  
            }  
           
            if(node.left){  
                traversal(node.left, curPath + '0');  
            }  
             
            if(node.right){  
                traversal(node.right, curPath + '1');  
            }  
        };  
        traversal(tree, '');  
        return hash;  
    }  
  

    getBinaryStr(map, originStr){  
        let result = '';  
        for(let i = 0; i < originStr.length; i++){  
            result += map[originStr[i]];  
        }  
        return result;  
    }  
}

let tree = new huffmanTree(data)  
console.log(map)
console.log(tree.binaryStr)
res.json({"result":map,"enc":tree.binaryStr})
});

app.get('/ex2/run-length',(req,res) => {
	data=req.query.data
	i=0
	n=data.length
	res_str=""
	res_arr=[]
	k=0
	while(i<n)
	{
		count=1
		while(i<n-1 && data[i]==data[i+1])
		{
			count+=1
			i+=1
		}
		i+=1
		res_arr[k++]=data[i-1]
		res_arr[k++]=String(count)


	}
	res_str=res_arr.join('')
	res.json({"result":res_str})

});


app.get('/ex3/lzw',(req,res) => {
	

var LZW = {
    compress: function (uncompressed) {

        var i = 256,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;

        while (i--) dictionary[String.fromCharCode(i)] = i;

        for (i = 0; i < uncompressed.length; i++) {
            c = uncompressed.charAt(i);
            wc = w + c;
           
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }

    
        if (w !== "") result.push(dictionary[w]);

        return result;
    },

    decompress: function (compressed) {

        var i = 256,
            dictionary = [],
            k,
            entry = "",
            dictSize = 256;

        while (i--) dictionary[i] = String.fromCharCode(i);


        var w = String.fromCharCode(compressed[0]);
        var result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }

            result += entry;

            dictionary[dictSize++] = w + entry.charAt(0);

            w = entry;
        }
        return result;
    }
};


	data=req.query.data
	enc=LZW.compress(data)
	dec=LZW.decompress(enc)
	res.json({"result":enc,"dec":dec})
});








	




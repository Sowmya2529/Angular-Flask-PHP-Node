import flask
import sys
from flask import Flask,request,render_template,jsonify,json
from flask_cors import CORS
import random
from heapq import heappush, heappop, heapify
from collections import defaultdict
from io import StringIO

app = Flask(__name__)
CORS(app)

def encode(symb2freq):
    """Huffman encode the given dict mapping symbols to weights"""
    heap = [[wt, [sym, ""]] for sym, wt in symb2freq.items()]
    heapify(heap)
    while len(heap) > 1:
        lo = heappop(heap)
        hi = heappop(heap)
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return sorted(heappop(heap)[1:], key=lambda p: (len(p[-1]), p))

def compress(uncompressed):
    """Compress a string to a list of output symbols."""
 
    # Build the dictionary.
    dict_size = 256
    dictionary = dict((chr(i), i) for i in range(dict_size))
    # in Python 3: dictionary = {chr(i): i for i in range(dict_size)}
 
    w = ""
    result = []
    for c in uncompressed:
        wc = w + c
        if wc in dictionary:
            w = wc
        else:
            result.append(dictionary[w])
            # Add wc to the dictionary.
            dictionary[wc] = dict_size
            dict_size += 1
            w = c
 
    # Output the code for w.
    if w:
        result.append(dictionary[w])
    return result
 
 
def decompress(compressed):
    """Decompress a list of output ks to a string."""
    
 
    # Build the dictionary.
    dict_size = 256
    dictionary = dict((i, chr(i)) for i in range(dict_size))
    # in Python 3: dictionary = {i: chr(i) for i in range(dict_size)}
 
    # use StringIO, otherwise this becomes O(N^2)
    # due to string concatenation in a loop
    result = StringIO()
    w = chr(compressed.pop(0))
    result.write(w)
    for k in compressed:
        if k in dictionary:
            entry = dictionary[k]
        elif k == dict_size:
            entry = w + w[0]
        else:
            raise ValueError('Bad compressed k: %s' % k)
        result.write(entry)
 
        # Add w+entry[0] to the dictionary.
        dictionary[dict_size] = w + entry[0]
        dict_size += 1
 
        w = entry
    return result.getvalue()
#...............Exercise 1.................
@app.route('/ex1/huffman',methods=['GET'])
def huffman():
	string=request.args.get('data')
	# Calculating frequency
	symb2freq = defaultdict(int)
	for ch in string:
		symb2freq[ch] += 1

	huff = encode(symb2freq)
	return jsonify({"result":huff})
#...............Exercise 2.................

@app.route('/ex2/run-length',methods=['GET'])
def runLength():
	data=request.args.get('data')
	res_str=""
	l=[]
	print(data)
	n=len(data)
	i=0
	while(i<n):
		count=1
		while (i<n-1 and data[i]==data[i+1]):
			count+=1
			i+=1

		i+=1
		l.append(data[i-1])
		l.append(str(count))
	
	res_str="".join(l)
	return jsonify({"result":res_str})

#...............Exercise 3.................
@app.route('/ex3/lzw',methods=['GET'])
def lzw():
	data=request.args.get('data')
	compressed = compress(data)
	print(compressed)
	decompressed=decompress(compressed)
	return jsonify({"result":compressed,"dec":decompressed})

if __name__=='__main__':
	 app.run(debug=True) #run app in debug mode on port 5000
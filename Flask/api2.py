import flask
import sys
from flask import Flask,request,render_template,jsonify,json
from flask_cors import CORS
import random
import math

app = Flask(__name__)
CORS(app)

#*****************************SET-2**************************************/

#******************Ex-1********************/

def gcdLcm(n1,n2):
	if n1>n2:
		num=n1
		den=n2
	else:
		num=n2
		den=n1
	r=num%den
	while r!=0:
		num=den
		den=r
		r=num%den
	gcd=den
	lcm=int(int(n1*n2)/int(gcd))
	l=[lcm,gcd]
	return l

def diffCube(n,mid):
	mid3=mid*mid*mid
	if n>mid3:
		return n-mid3
	return mid3-n 

def binarySearchCube(start,end,e,num):
	while(1):
		mid=(start+end)/2
		error=diffCube(num,mid)
		if error<=e:
			return mid
		if (mid*mid*mid)>num:
			end=mid
		else:
			start=mid

def sqroot(num):  #babylonian theoren
	if num==0:
		r=0
	else:
		g=num/2.0
		g2=g+1
		while g!=g2:
			n=num/g
			g2=g
			g=(g+n)/2
		r=round(g,6)
		return r

def variance(l):
	sum=0
	avg=0
	sqDiff=0
	n=len(l)
	for i in range(0,n):
		sum+=l[i]
	avg=sum/n
	for i in range(0,n):
		sqDiff+=((l[i]-avg)*(l[i]-avg))
	return sqDiff/n


def Log(n,b):
	r=ln(n)/ln(b)
	#r=round(r,3)
	return r

def ln(x):
	n=100000.0
	return n*((x**(1/n))-1)

def antilog(n,b):
	return (b**n)


@app.route('/ex1/electric-calc',methods=['GET'])
def electric_calc():
	op=request.args.get('operation')
	value1=request.args.get('data1')
	value2=request.args.get('data2')
	value1=float(value1)
	value2=float(value2)
	r=0.0
	resultOp=""
	unit=""
	if op=='1':
		i=value1
		v=value2
		p=(v*i)/1000
		r=p
		resultOp="Power"
		unit="kW"
	elif op=='2':
		i=value1
		v=value2
		kva=(i*v)/1000
		r=kva
		resultOp="Kilovolt-Amp"
		unit="kVA"	
	elif op=='3':
		i=value1
		w=value2
		v=w/i
		r=v
		resultOp="Voltage"
		unit="V"
	elif op=='4':
		e=value1
		t=value2
		p=e/t
		r=p
		resultOp="Power"
		unit="W"
	elif op=='5':
		e=value1
		c=value2
		v=e/c
		r=v
		resultOp="Voltage"
		unit="V"
	elif op=='6':
		kva=value1
		v=value2
		i=(kva*1000)/v
		r=i
		resultOp="Amps"
		unit="A"
	elif op=='7':
		kva=value1
		pf=value2
		p=1000*kva*pf
		r=p
		resultOp="Power"
		unit="W"
	elif op=='8':
		p=value1
		v=value2
		i=(p*1000)/v
		r=i
		resultOp="Amps"
		unit="A"
	elif op=='9':
		p=value1
		i=value2
		v=(p*1000)/i
		r=v
		resultOp="Voltage"
		unit="V"
	elif op=='10':
		p=value1
		t=value2
		kwh=p*t
		r=kwh
		resultOp="Kilowatt-hours"
		unit="kWh"
	elif op=='11':
		p=value1
		pf=value2
		va=(1000*p)/pf
		r=va
		resultOp="Volt-amps"
		unit="VA"
	elif op=='12':
		va=value1
		v=value2
		i=va/v
		r=i
		resultOp="Amps"
		unit="A"
	elif op=='13':
		va=value1
		pf=value2
		p=va*pf
		r=p
		resultOp="Power"
		unit="W"
	elif op=='14':
		v=value1
		p=value2
		i=p/v
		r=i
		resultOp="Amps"
		unit="A"
	elif op=='15':
		v=value1
		i=value2
		p=v*i
		r=p
		resultOp="Power"
		unit="W"
	elif op=='16':
		v=value1
		c=value2
		e=v*c
		r=e
		resultOp="Energy"
		unit="J"
	elif op=='17':
		e=value1
		v=value2
		mah=(1000*e)/v
		r=mah
		resultOp="Milliamp-hours"
		unit="mAh"
	elif op=='18':
		mah=value1
		v=value2
		wh=(mah*v)/1000
		r=wh
		resultOp="Watt-hours"
		unit="Wh"
	r=round(r,4)
	return jsonify({"result":r,"resultop":resultOp,"unit":unit})

@app.route('/ex2/log1-calc',methods=['GET'])
def log1_result():	
	number=request.args.get('number')
	op=request.args.get('operation')
	r=0
	if op=="log":
		base=request.args.get('base')
		r=Log(float(number),float(base))
		r=round(r,3)

	elif op=="antilog":
		base=request.args.get('base')
		r=antilog(float(number),float(base))
		r=round(r,4)
	else:
		r=ln(float(number))
		r=round(r,4)

	return jsonify({"result":r})


@app.route('/ex3/log2-calc',methods=['GET'])
def log3_result():
	data=request.args.get('data')
	numbers=data.split(',')
	operation=request.args.get('operation')
	print(numbers,operation)
	if operation=="gcd" or operation=="lcm":
		if(len(numbers)==1):
			return jsonify({"result":numbers[0]})
		else:
			result=gcdLcm(int(numbers[0]),int(numbers[1]))
			if len(numbers)>2:
				for i in range(2,len(numbers)):
					result=gcdLcm(result[1],int(numbers[i]))
			if operation=="gcd":
				r=result[1]
			else:
				r=result[0]
		

			print(data)
			return jsonify({"result":r})
	
	elif operation=="sqrt":
		num=float(numbers[0])
		r=sqroot(num)

		return jsonify({"result":r})

	elif operation=="cbrt":
		num=float(numbers[0])
		start=0
		end=num
		e=0.0000001
		r=binarySearchCube(start,end,e,num)
		r=round(r,6)
		return jsonify({"result":r})

	elif operation=="nrt":
		a=float(numbers[0])
		n=float(numbers[1])
		x_pre=random.randint(1,101)%10
		e=0.001
		maxX=2147483647
		x_cur=0.0

		while(maxX>e):
			x_cur=((n-1.0)*x_pre+a/pow(x_pre,n-1))/n
			maxX=abs(x_cur-x_pre)
			x_pre=x_cur
		r=x_cur
		r=round(r,6)
		return jsonify({"result":r})


@app.route('/ex5/stat-calc',methods=['GET'])
def stat_result():
	op=request.args.get('operation')
	list1=request.args.get('list1')
	list1=list(map(float,list1.split(',')))
	print(op,list1)
	list2=[]
	r=0.0
	if(op=="linearregression"):
		list2=request.args.get('list2')
		list2=list(map(float,list2.split(',')))
		sumx=sumy=sumx2=sumxy=0
		n=len(list1)
		for i in range(0,n):
			sumx+=list1[i]
			sumy+=list2[i]
			sumx2+=(list1[i]*list1[i])
			sumxy+=(list1[i]*list2[i])
		
		m=(n*sumxy-sumx*sumy)/(n*sumx2-sumx*sumx)
		meanx=sumx/n
		meany=sumy/n
		c=meany-m*meanx
		m=round(m,3)
		c=round(c,3)
		res_str="y="+str(m)+"x+("+str(c)+")"
		slope=m
		intercept=c
		return jsonify({"result":res_str,"slope":slope,"intercept":intercept})
	elif op=="variance":

		r=variance(list1)
		r=round(r,6)
		return jsonify({"result":r})
	elif op=="stddeviation":
		var=variance(list1)
		r=sqroot(var)
		#print(list1,list2)
		return jsonify({"result":r})






if __name__=='__main__':
	 app.run(debug=True) #run app in debug mode on port 5000
const express = require("express");

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 3200;
var cors = require('cors');
var QRCode = require('qrcode')
const md5 = require('md5') 
app.use(cors());
// middleware
 app.use('/public/ORCode', express.static(__dirname + '/public/ORCode'));
app.use(bodyparser.json());
//app.use(bodyparser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`running at port ${port}`);
});



app.get('/ex1',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/datetime_1.html');
});

app.get('/datetime-difference',(req,res) => {

	console.log('api hit');
	var date1=req.query.date1;
	var date2=req.query.date2;
   
 	const month_days=[0,31,28,31,30,31,30,31,31,30,31,30,31];

//retrieving individual values ..iput date is in string format->convert to integer for calculations

var year1=parseInt(date1.slice(0,4));
var year2=parseInt(date2.slice(0,4));
var month1=parseInt(date1.slice(5,7));
var month2=parseInt(date2.slice(5,7));
var day1=parseInt(date1.slice(8,10));
var day2=parseInt(date2.slice(8,10));
var hr1=parseInt(date1.slice(11,13));
var hr2=parseInt(date2.slice(11,13));
var min1=parseInt(date1.slice(14,16));
var min2=parseInt(date2.slice(14,16));
var res_yr,res_month,res_day,res_hr,res_min,larger,smaller;

console.log(year1,year2,month1,month2,day1,day2,hr1,hr2,min1,min2);




function isLeap(year)
{
	if( (0 == year % 4) && (0 != year % 100) || (0 == year % 400) )  
     {  
         return true;   
     }  
    else  
     {  
        return false;   
     }  
}


//finding minute difference
function min_diff(min1,min2,larger)
{
	                      //global allows access of vars declared outside the functions..variables which are to be manipulated inside the functions are declared as global in the below functions
	if(min1>=min2)
		return min1-min2;
	else
	{
		if(larger==1)
			hr1=hr1-1;
		else
			hr2=hr2-1;
		return (min1+60)-min2;
	}
}


//finging hour difference
function hour_diff(hr1,hr2,larger)
{

	if(hr1>=hr2)
		return hr1-hr2;
	else
	{
		if(larger==1)
			day1=day1-1;
		else
			day2=day2-1;
		
		return (hr1+24)-hr2;
	}
}


//finding days difference
function days_diff(day1,day2,larger,month_days)
{
	
 
	if(day1>=day2)
		return day1-day2;
	else
	{
		var temp_month;
		if(larger==1)
		{
			
			//echo $day1, $day2, $month1,$month2;
			if(month1==1)
			{
				month1=12;
				year1=year1-1;
			}
			else
				month1=month1-1;
			temp_month=month1;
			temp_year=year1;
		}
		else if(larger==2)
		{
			if(month2==1)
			{
				month2=12;
				year2=year2-1;
			}
			else
				month2=month2-1;
			temp_month=month2;
			temp_year=year2;
		}

        if(temp_month==2)
		{
			if(isLeap(temp_year))
			{
				return (day1+29)-day2;
			}
			else
				return (day1+28)-day2;

		}

		else
		{
				//$month1=$month1-1;
			return (day1+month_days[temp_month])-day2;
		}
			

	}
}

//finding months difference
function month_diff(m1,m2,larger)
{
	
	//echo $m1,$m2;
	if(m1>=m2)
		return m1-m2;
	else
	{
		if(larger==1)
		    year1=year1-1;
		else
			year2=year2-1;
		return (m1+12)-m2;


	}	
}

//finding year difference
function year_diff(y1,y2)
{
	return y1-y2;
}


//function called when first date is larger
function result_case1()
{
    
    larger=1;
    res_min=min_diff(min1,min2,larger);
    res_hr=hour_diff(hr1,hr2,larger);
    res_day=days_diff(day1,day2,larger,month_days);
    res_month=month_diff(month1,month2,larger);
    res_yr=year_diff(year1,year2);
}


//function called when second date is larger
function result_case2()
{
	
	larger=2;
    res_min=min_diff(min2,min1,larger);
    res_hr=hour_diff(hr2,hr1,larger);
    res_day=days_diff(day2,day1,larger,month_days);
    res_month=month_diff(month2,month1,larger);
    res_yr=year_diff(year2,year1);
}

//vars to hold the smallest and largest date (Used in calculations)
if(date1=== "" || date2=== "")
{	res.status(400);
	res.json({'error':'null input'})
	
}
else
{
    //checking if year of first date is larger
	if(year1>year2)
    	result_case1();
	else if(year2>year1)
		result_case2();

	//if both dates are similar,checking which month is larger
	else 
	{
		if(month1>month2)
			result_case1();
	
		else if(month2>month1)
			result_case2();

	//if both months are similar,checking which day is larger
		else
		{
			if(day1>day2)
				result_case1();
			else if(day2>day1)
				result_case2();

			//if both days are similar->same date..in this case,compare hours and min..
			else if(hr1>hr2)
				result_case1();
			else if(hr2>hr1)
				result_case2();
			else if(min1>min2)
				result_case1();
			else if (min2>min1)
				result_case1();
			else
				result_case1();
		}
	}
	// set response code - 200 OK
   
	//convert integer to string and put it in an array
    res_array=[res_yr.toString().concat(" years"),res_month.toString().concat(" months"),res_day.toString().concat(" days"),res_hr.toString().concat(" hours"),res_min.toString().concat(" minutes")];
  	//result string
    res_string=res_array.toString();
    
    // make it json format
   
}


 	 res.json({'diff':res_string});
 	
});



app.get('/ex2',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/settheory_2.html');
});


app.get('/set-op',(req,res) => {
 
	//console.log("api hit")
	const set1=req.query.set1
	const set2=req.query.set2
	const set_op=req.query.operation
	let res_set=[];
	//console.log(set1,set2,set_op)
	if(set_op=="union")
	{
		res_set=set1
		for(let i=0;i<set2.length;i++ )
		{
			if(!res_set.includes(set2[i]))
				res_set.push(set2[i])
		}
	}
	else if(set_op=="intersection")
	{
		for(let i=0;i<set1.length;i++)
		{
			if(set2.includes(set1[i]))
				res_set.push(set1[i])
		}
	}

	else if(set_op=="a-b")
	{
		for(let i=0;i<set1.length;i++)
		{
			if(!set2.includes(set1[i]))
				res_set.push(set1[i])
		}
	}
	else
	{
      for(let i=0;i<set2.length;i++)
		{
			if(!set1.includes(set2[i]))
				res_set.push(set2[i])
		}
	}	

res.json({"result":res_set})
});


app.get('/ex3',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/matrix_3.html');
});


app.get('/mat-op',(req,res) => {

	
	let row=req.query.row
	let col=req.query.col
	let matrix=req.query.matrix
	let mat_op=req.query.operation
	let matrix1=[]
	let res_mat=[]
	
	let k=0
	for(let i=0;i<row;i++)
	{		
		matrix1[i]=[]
		res_mat[i]=[]
	}
	for(let i=0;i<row;i++)
		for(let j=0;j<col;j++)
			matrix1[i][j]=matrix[k++]

	//console.log(matrix1)
	//console.log(matrix,row,col,mat_op)
	if(mat_op=="transpose")
	{
		for(let i=0;i<col;i++)
			for(let j=0;j<row;j++)
				res_mat[i][j]=matrix1[j][i]
		res.json({"result":res_mat})

	}
	else if(mat_op=="lower_left_diagonal")
	{
		k=0
		for(let i=0;i<row;i++)
			for(let j=0;j<=i;j++)
				res_mat[k++]=matrix1[i][j]
		res.json({"result":res_mat})
	}
	else if(mat_op=="lower_right_diagonal")
	{
		k=0
		for(let i=0;i<row;i++)
			for(let j=col-1-i;j<col;j++)
				res_mat[k++]=matrix1[i][j]
		res.json({"result":res_mat})
	}
	else if(mat_op=="upper_right_diagonal")
	{
		k=0
		for(let i=0;i<row;i++)
			for(let j=i;j<row;j++)
				res_mat[k++]=matrix1[i][j]
		res.json({"result":res_mat})
	}
	else if(mat_op=="upper_left_diagonal")
	{
		k=0
		for(let i=0;i<row;i++)
			for(let j=0;j<col-i;j++)
				res_mat[k++]=matrix1[i][j]
		res.json({"result":res_mat})
	}
	else
	{
		 for (let x = 0; x < row/ 2; x++) 
		 { 
            // Consider elements in group 
            // of 4 in current square 
            for (let y = x; y < row - x - 1; y++) 
            { 
                // Store current cell in 
                // temp variable 
                let temp = matrix1[x][y]; 
  
                // Move values from right to top 
                matrix1[x][y] = matrix1[y][row - 1 - x]; 
  
                // Move values from bottom to right 
                matrix1[y][row - 1 - x] 
                    = matrix1[row - 1 - x][row - 1 - y]; 
  
                // Move values from left to bottom 
                matrix1[row - 1 - x][row - 1 - y] = matrix1[row - 1 - y][x]; 
  
                // Assign temp to left 
                matrix1[row - 1 - y][x] = temp; 
            } 
        } 
        res.json({"result":matrix1})
	}
	

});



app.get('/ex4',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/numtoword_4.html');
});


app.get('/numtoword',(req,res) => {
	let num=req.query.number
	let count=0
	let res_str=""

	const one = [ "", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", 
              "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen " ] 

	const ten = [ "", "", "twenty ", "thirty ", "forty ", "fifty ", "sixty ", "seventy ", "eighty ", "ninety " ]


    function digits(n,count)
     {

   		if(n)
   		{
      		return digits(Math.floor(n / 10), ++count);
   		}
   		return count;
	}

	function numToWords(n,s) 
	{ 
    	let str = ""; 
    
    	if (n > 19) 
        	str += ten[Math.floor(n / 10)] + one[n % 10]; 
    	else
        	str += one[n]; 
  
    	if (n) 
        	str += s; 
  	//console.log(str)
    return str; 
} 
	let d=digits(num,count)
	if(d>9)
		res_str="Please enter a number within 9 digits!"
	else
	{
		res_str += numToWords((Math.floor(num / 10000000)), "crore "); 
    	res_str += numToWords((Math.floor(num / 100000) % 100), "lakh "); 
    	res_str += numToWords((Math.floor(num / 1000) % 100), "thousand "); 
    	res_str += numToWords((Math.floor(num / 100) % 10), "hundred "); 
  
 	   	if (num > 100 && num % 100) 
        	res_str += "and "; 
    	res_str += numToWords((num % 100), ""); 
	}

	res.json({"result":res_str})
});

app.get('/ex6',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/md5_6.html');
});


app.get('/md5',(req,res) => {
	str=req.query.string
	res_str=md5(str)
	res.json({"result":res_str})

});

app.get('/ex8',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/qrcode_8.html');
});


app.get('/qr',(req,res) => {

	let str=req.query.string
	const max=100
	const min=1
	const n=Math.floor(Math.random() * (max - min) + min);
	res_str=""
	s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	for(let i=0;i<5;i++)
	{
		let index=Math.floor(Math.random()*(s.length));
		res_str+=s[index]
	}
	res_str+="_"+n+"_OR.png"
	const generateQR = async text => {
  	try {
    await QRCode.toFile("C:/soa-lab-nodeapi/QRCode/"+res_str, str);
  	} 
  	catch (err)
  	 {
    console.error(err)
  	}

	}
	generateQR(str)
	res.json({"result":res_str})
});


app.get('/ex9',(req,res) => {
	res.sendFile('C:/soa-lab-nodeapi/otp_9.html');
});


app.get('/otp',(req,res) => {

	const type=req.query.otp_type
	const max=13
	const min=4
	const n=Math.random() * (max - min) + min;
	res_str=""
	if(type=="number")
		s="1234567890"
	else if(type=="alphabet")
		s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	else
		s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234560789"
	for(let i=0;i<n;i++)
	{
		let index=Math.floor(Math.random()*(s.length));
		res_str+=s[index]
	}
	res.json({"result":res_str})

});





/*********EXERCISES SET-2******* */

app.get('/ex1/electric-calc',(req,res) => {

	let op=req.query.operation
	let value1=req.query.data1
	let value2=req.query.data2
	value1=parseFloat(value1)
	value2=parseFloat(value2)
	let r=0.0
	let resultOp;
	let unit;
	console.log("api hit",op)
	if(op=='1')
	{
		i=value1
		v=value2
		p=(i*v)/1000
		console.log(p)
		r=p
		resultOp="Power"
		unit="kW"

	}
	else if(op=='2')
	{
		i=value1
		v=value2
		kva=(i*v)/1000
		r=kva
		resultOp="Kilovolt-Amp"
		unit="kVA"

	}
	else if(op=='3')
	{
		i=value1
		w=value2
		v=w/i
		r=v
		resultOp="Voltage"
		unit="V"
	}
	else if(op=='4')
	{
		e=value1
		t=value2
		p=e/t
		r=p
		resultOp="Power"
		unit="W"

	}
	else if(op=='5')
	{
		e=value1
		c=value2
		v=e/c
		r=v
		resultOp="Voltage"
		unit="V"
	}
	else if(op=='6')
	{
		kva=value1
		v=value2
		i=(kva*1000)/v
		r=i
		resultOp="Amps"
		unit="A"
	}
	else if(op=='7')
	{
		kva=value1
		pf=value2
		p=1000*kva*pf
		r=p
		resultOp="Power"
		unit="W"
	}
	else if(op=='8')
	{
		p=value1
		v=value2
		i=(p*1000)/v
		r=i
		resultOp="Amps"
		unit="A"
	}
	else if(op=='9')
	{
		p=value1
		i=value2
		v=(p*1000)/i
		r=v
		resultOp="Voltage"
		unit="V"
	}
	else if(op=='10')
	{
		p=value1
		t=value2
		kwh=p*t
		r=kwh
		resultOp="Kilowatt-hours"
		unit="kWh"		
	}
	else if(op=='11')
	{
		p=value1
		pf=value2
		va=(1000*p)/pf
		r=va
		resultOp="Volt-amps"
		unit="VA"
	}
	else if(op=='12')
	{
		va=value1
		v=value2
		i=va/v
		r=i
		resultOp="Amps"
		unit="A"
	
	}
	else if(op=='13')
	{
		va=value1
		pf=value2
		p=va*pf
		r=p
		resultOp="Power"
		unit="W"
	}
	else if(op=='14')
	{
		v=value1
		p=value2
		i=p/v
		r=i
		resultOp="Amps"
		unit="A"		
	}
	else if(op=='15')
	{
		v=value1
		i=value2
		p=v*i
		r=p
		resultOp="Power"
		unit="W"
	}
	else if(op=='16')
	{
		v=value1
		c=value2
		e=v*c
		r=e
		resultOp="Energy"
		unit="J"
	}
	else if(op=='17')
	{
		e=value1
		v=value2
		mah=(1000*e)/v
		r=mah
		resultOp="Milliamp-hours"
		unit="mAh"
	}
	else if(op=='18')
	{
		mah=value1
		v=value2
		wh=(mah*v)/1000
		r=wh
		resultOp="Watt-hours"
		unit="Wh"		
	}
	r=Math.round( r * 10000 + Number.EPSILON ) / 10000
	res.json({"result":r,"resultop":resultOp,"unit":unit})
});

app.get('/ex2/log1-calc',(req,res) => {

	function Log(n,b)
	{
		r=ln(n)/ln(b)
		return r
	}
	function ln(x)
	{
		let n=100000.0
		return n*((x**(1/n))-1)
	}
	function antilog(n,b)
	{
		return Math.pow(b,n)
	}

	let number=req.query.number
	let op=req.query.operation
	let base
	let r=0;
	number=parseFloat(number)
	if(op=="log")
	{
		base=req.query.base
		base=parseFloat(base)
		r=Log(number,base)
		r=Math.round( r * 1000 + Number.EPSILON ) / 1000
	}
	else if(op=="antilog")
	{
		base=req.query.base
		base=parseFloat(base)
		r=antilog(number,base)
		r=Math.round( r * 10000 + Number.EPSILON ) / 10000
	}
	else
	{
		r=ln(number)
		r=Math.round( r * 10000 + Number.EPSILON ) / 10000
	}

	res.json({"result":r})


});

app.get('/ex3/log2-calc',(req,res) => {
   function getGcd(n1,n2)
	{
		if (n1>n2)
		{	num=n1
			den=n2
		}
		else
		{
			num=n2
			den=n1
		}
		r=num%den
		while(r!=0)
		{
			num=den
			den=r
			r=num%den
		}
		gcd=den
		return gcd
	}
    function diffCube(n,mid)
    {
		mid3=mid*mid*mid
		if (n>mid3)
			return n-mid3
		return mid3-n 
	}
	function binarySearchCube(start,end,e,num)
	{
		while(1)
		{	
		mid=(start+end)/2
		error=diffCube(num,mid)
		if (error<=e)
			return mid
		if ((mid*mid*mid)>num)
			end=mid
		else
			start=mid
		}
	}
    console.log("api hit")
	let data=req.query.data
	let operation=req.query.operation
	let numbers=data.split(',')
	let r=0
	if (operation=="gcd" || operation=="lcm")
	{
		if(numbers.length==1)
			r=parseFloat(numbers[0])
		else
		{
			gcd=getGcd(parseFloat(numbers[0]),parseFloat(numbers[1]))
			lcm=parseFloat(numbers[0])*parseFloat(numbers[1])/gcd
			if(numbers.length>2)
				{
					for(let i=0;i<numbers.length;i++)
					{
						gcd=getGcd(gcd,parseFloat(numbers[i]))
						lcm=(parseFloat(numbers[i])*lcm)/getGcd(parseFloat(numbers[i]),lcm)
					}
				}
			if(operation=="gcd")
				r=gcd
			else
				r=lcm

			
		}
	}
	//r="hi";
	else if (operation=="sqrt")
	{
		num=parseFloat(numbers[0])
		if(num==0)
			r=0
		else
		{
			g=num/2.0
			g2=g+1
			while(g!=g2)
			{
				n=num/g
				g2=g
				g=(g+n)/2

			}
			//r=g.toPrecision(6)
			//r=g
			r=Math.round( g * 100 + Number.EPSILON ) / 100
		}
		
	}
	else if(operation=="cbrt")
	{
		num=parseFloat(numbers[0])
		start=0
		end=num
		e=0.0000001
		r=binarySearchCube(start,end,e,num)
		//r=r.toPrecision(5)
		r=Math.round( r * 100 + Number.EPSILON ) / 100

	}
	else if (operation=="nrt")
	{
		a=parseFloat(numbers[0])
		n=parseFloat(numbers[1])
		x_pre=Math.random(1,102)%10
		e=0.001
		maxX=2147483647
		x_cur=0.0
		while(maxX>e)
		{
			x_cur=((n-1.0)*x_pre+a/Math.pow(x_pre,n-1))/n
			maxX=Math.abs(x_cur-x_pre)
			x_pre=x_cur
			//r=r.toPrecision(5)
		}
		//r=x_cur
		r=Math.round( x_cur * 100 + Number.EPSILON ) / 100

	}
	res.json({"result":r})


});

app.get('/ex4/log3-calc',(req,res) => {

	function radians (angle) {
  		return angle * (Math.PI / 180);
	}

	let op=req.query.operation
	let value=parseFloat(req.query.value)
	let undef=""
	let r=0
	if (op=="sin")
		r=Math.sin(radians(value))
	
	else if (op=="cos")
		r=Math.cos(radians(value))
	
	else if (op=="tan")
	{
		if (value==90.0)
			undef="undefined"
		else
			r=Math.tan(radians(value))
	}
	else if (op=="arcsin")
	{	r=Math.asin(value)
		r=r*(180/Math.PI)
		//r=String(r)+" degrees"
	}
	else if (op=="arccos")
	{	r=Math.acos(value)
		r=r*(180/Math.PI)
		//r=String(r)+" degrees"
	}
 
	else if (op=="arctan")
	{	r=Math.atan(value)
		r=r*(180/Math.PI)
		//r=String(r)+" degrees"
	}

	else if (op=="cosec")
	{
		if (value==0)
			undef="undefined"
		else
			r=1/Math.sin(radians(value))
	}
	else if (op=="sec")
	{
		if (value==90)
			undef="undefined"
		else
			r=1/Math.cos(radians(value))
	}
	else
	{
		if(value==0)
			undef="undefined"
		else
			r=1/Math.tan(radians(value))
	}
	if (undef)
		r=undef
	else
		r=Math.round( r * 10000 + Number.EPSILON ) / 10000

	res.json({"result":r})


});

app.get('/ex5/stat-calc',(req,res) => {

	
	function sqroot(num)
	{
		let r,g,g2,n;
		if(num==0)
			r=0
		else
		{
			g=num/2.0
			g2=g+1
			while(g!=g2)
			{
				n=num/g
				g2=g
				g=(g+n)/2
			}
			r=Math.round( g * 10000 + Number.EPSILON ) / 10000
			return r
		}
	}

	function variance(l)
	{
		let sum=0
		let avg=0
		let sqDiff=0
		let n=l.length
		for(let i=0;i<n;i++)
		{
			sum+=l[i]
			
		}
		avg=sum/n
		for(let i=0;i<n;i++)
			sqDiff+=((l[i]-avg)*(l[i]-avg))
		return sqDiff/n
	}



	let list1=req.query.list1
	console.log(list1)
	let op=req.query.operation
	let list2=[]
	r=0.0
	list1=list1.split(',').map(Number)
	 if(op=="linearregression")
	 {
	 	list2=req.query.list2
		list2=list2.split(',').map(Number)
		sumx=sumy=sumx2=sumxy=0
		n=list1.length
		for(let i=0;i<n;i++)
		{
			sumx+=list1[i]
			sumy+=list2[i]
			sumx2+=(list1[i]*list1[i])
			sumxy+=(list1[i]*list2[i])
		}
		m=(n*sumxy-sumx*sumy)/(n*sumx2-sumx*sumx)
		meanx=sumx/n
		meany=sumy/n
		c=meany-m*meanx
		m=Math.round( m * 1000 + Number.EPSILON ) / 1000
		c=Math.round( c * 1000 + Number.EPSILON ) / 1000
		// m=Math.round(m)
		// c=Math.round(c)
		res_str="y="+m+"x+("+c+")"
		slope=m
		intercept=c
		res.json({"result":res_str,"slope":slope,"intercept":intercept})
	}
	else if(op=="stddeviation")
	{
	
		let v=variance(list1)
        r=sqroot(v)
		res.json({"result":r})

	}
	else
	{
        console.log(op,list1)
		r=variance(list1)
		r=Math.round( r * 1000 + Number.EPSILON ) / 1000
		res.json({"result":r})  

	}

});



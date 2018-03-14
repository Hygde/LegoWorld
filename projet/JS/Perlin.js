logger.info(new Error().stack+" : Loading Perlin Noise");

var ImprovedNoise = function(){
	//source @ http://mrl.nyu.edu/~perlin/noise/
	var perm = [];


	//initialize the permutation array with random value
	function initPermArray(){
		var index, pivot;
		for(var i = 0; i<256; i++)perm[i] = i;
		for(var i = 0; i<2;i++){//mix perm array[] twice
			for(var j = 0; j<256; j++){
				pivot = perm[j];
				index = Math.random()*256;
				perm[j] = perm[index];
				perm[index] = pivot;
			}
		}
		for(var i = 0; i < 256; i++) perm[256+i] = perm[i];//size of perm array = 512
	}
	function fade(valeur)  { return valeur * valeur * valeur * (valeur * (valeur * 6 - 15) + 10); }
	function lerp(t, a, b) { return a + t * (b - a); }//linear interpolation
	function grad(hash, xp, yp, zp) {//calculate the gradient value of a vec3
	   var grad_h, grad_u, grad_v;
       grad_h = hash & 15;//[0;15] owns grad_h
       grad_u = grad_h<8 ? xp : yp;//INTO 12 GRADIENT DIRECTIONS.
	   grad_v = grad_h<4 ? yp : grad_h==12||grad_h==14 ? xp : zp;
      return ((grad_h&1) == 0 ? grad_u : -grad_u) + ((grad_h&2) == 0 ? grad_v : -grad_v);
   }

   initPermArray();//initialization

	return {
		noise: function(x, y, z){//return a value for x,y,z coordinates
			var X,Y,Z;
			var u,v,w;
			var A, AA, AB, B, BA, BB;

			X = Math.floor(x) & 255;//[0;255] owns X
			Y = Math.floor(y) & 255;
			Z = Math.floor(z) & 255;

			x -= Math.floor(x);//[0;1] owns x
			y -= Math.floor(y);
			z -= Math.floor(z);

			u = fade(x);//fade curve of x
			v = fade(y);
			w = fade(z);

			//coordinates of the 8 corners of the cube
			A = perm[X]+Y;
			AA = perm[A]+Z;
			AB = perm[A+1]+Z;
			B = perm[X+1]+Y;
			BA = perm[B]+Z;
			BB = perm[B+1]+Z;

			return lerp(w, lerp(v, lerp(u, grad(perm[AA], x, y, z), grad(perm[BA], x-1, y  , z)),
					lerp(u, grad(perm[AB], x, y-1, z), grad(perm[BB], x-1, y-1, z))),
					lerp(v, lerp(u, grad(perm[AA+1], x, y, z-1 ), grad(perm[BA+1], x-1, y, z-1)),
					lerp(u, grad(perm[AB+1], x, y-1, z-1), grad(perm[BB+1], x-1, y-1, z-1))));
		}
	}
};

var SimplexNoise = function(){//todo: implement simplex noise algorithm to generate world

};

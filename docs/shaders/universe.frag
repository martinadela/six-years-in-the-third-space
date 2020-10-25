// import noise from 'glsl-noise/classic/3d'
// import worley3D from 'glsl-worley/worley3D'

varying vec2 vUv;
uniform int index;
uniform float seed;
uniform float resolution;
uniform float res1;
uniform float res2;
uniform float resMix;
uniform sampler2D nebulaeMap;
uniform float starsQuantity;
uniform vec3 filterColor;
uniform float filterOpacity;
uniform float nebulaOpacity;
uniform float whiteCloudsIntensity;

const int octaves = 16;

vec3 getSphericalCoord(int index, float x, float y, float width) {
	width /= 2.0;
	x -= width;
	y -= width;
	vec3 coord = vec3(0.0, 0.0, 0.0);

	if (index == 0) {coord.x=width; coord.y=-y; coord.z=-x;}
	else if (index == 1) {coord.x=-width; coord.y=-y; coord.z=x;}
	else if (index == 2) {coord.x=x; coord.y=width; coord.z=y;}
	else if (index == 3) {coord.x=x; coord.y=-width; coord.z=-y;}
	else if (index == 4) {coord.x=x; coord.y=-y; coord.z=width;}
	else if (index == 5) {coord.x=-x; coord.y=-y; coord.z=-width;}

	return normalize(coord);
}

float simplex(vec3 pos, float seed) {
	float n = perlinNoise(vec3(pos + seed));
	// return (n + 1.0) * 0.5;
	n = (n + 1.0) * 0.5;
	// n = 2.0 * (0.5 - abs(0.5 - n));
	return n;
}

float baseNoise(vec3 pos, float frq, float seed ) {
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  simplex(vec3(pos.x*gain/frq, pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}


	// n = fract(n*10.0);




	// n *= abs(sin(pos.y*10.0));

	// n += 0.4;

	// increase contrast
	n = ( (n - 0.5) * 3.0 ) + 0.6;

	// n = pow(n, 3.0);

	// n = pow( (1.0-n), 2.0);


	// n = pow(n, 2.0);


	// n = 1.0-n;
	// n = pow(n, 6.0);
	// n = 1.0-n;

	return n;
}

float cloud(vec3 pos, float seed) {
	float n = perlinNoise(vec3(pos + seed));
	// n = sin(n*4.0 * cos(n*2.0));
	n = sin(n*7.0);

	n = n*0.5 + 0.5;
	// n = 1.0-n;
	// n = n*1.2;
	// n = 1.0-n;

	return n;
}

float cloudNoise(vec3 pos, float frq, float seed) {
	float amp = 0.5;

	float n = 0.0;
	float gain = 1.0;
	for(int i=0; i<octaves; i++) {
		n +=  cloud(vec3(pos.x*gain/frq, 1.0*pos.y*gain/frq, pos.z*gain/frq), seed+float(i)*10.0) * amp/gain;
		gain *= 2.0;
	}

	// n = pow(n, 5.0);

	n = 1.0-n;
	n = pow(n, 1.0);
	n = 1.0-n;

	return n;
}


void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;
	vec3 sphericalCoord = getSphericalCoord(index, x*resolution, y*resolution, resolution);
    vec3 starsFilter = filterColor / 255.0;

    // create nebula + white clouds
	float c1 = cloudNoise(sphericalCoord, res1, seed);
	float c2 = cloudNoise(sphericalCoord + vec3(c1*res2*0.2), res2, seed+310.4);
    float c3 = cloudNoise(sphericalCoord, resMix, seed + 661.384);
    float nebulaStrength = 2.0 * pow(c2, 3.0);
	vec3 nColor = texture2D(nebulaeMap, vec2(c3, c1)).rgb * nebulaStrength;
    vec3 nebulaColor = nColor;

	// add in large stars to nebula
    float sub1 = baseNoise(sphericalCoord, 0.003, seed+322.284);
	vec2 F = worley((sphericalCoord * 150.0) + vec3(seed+35.890), 1.0, true);
	float F1 = F.x;
	float n2 = F1;
	n2 = 1.0 - n2;
	n2 *= starsQuantity;
	n2 = pow(n2, 9.0);
    n2 *= c2;
    n2 *= sub1;

	vec3 starsColor = vec3(clamp(n2, 0.0, 1.0));
	vec3 skyColor = vec3(1.0) * (1.0 - filterOpacity) + filterOpacity * starsFilter;
	vec3 starsAndSkyColor = starsColor + skyColor;
	

    // Blend stars and nebula
    float nebulaIntensity = length(nebulaColor) / sqrt(3.0);
    vec3 totalColor = nebulaColor * nebulaOpacity;
    totalColor += starsAndSkyColor * (1.0 - nebulaIntensity);

    vec4 total = vec4(totalColor, 1.0);

    // Add white clouds
    total.a = pow(c2, whiteCloudsIntensity);

	// gl_FragColor = nebula;
    // gl_FragColor = stars;
    gl_FragColor = total;
    // gl_FragColor = white + stars;
}
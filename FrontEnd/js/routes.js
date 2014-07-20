var names=['Black Wind', 'Dagger', "Dagon's Feast", 'Esgred', 'Fingerdancer', 'Foamdrinker', 'Forlorn Hope', 'Golden Storm', 'Great Kraken', 'Grey Ghost', 'Grief', 'Hardhand', 'Iron Lady', 'Iron Vengeance', 'Iron Victory', 'Iron Wind', 'Iron Wing', 'Kite', "Kraken's Kiss", 'Lamentation', 'Leviathan', 'Lord Dagon', 'Lord Quellon', 'Lord Vickon', "Maiden's Bane", 'Nightflyer', 'Reapers Wind', 'Red Jester', 'Red Tide', 'Salty Wench', 'Sea Bitch', 'Sea Song', 'Seven Skulls', 'Shark', 'Silence', 'Silverfin', 'Sparrowhawk', 'Swiftin', "Thrall's Bane", 'Thunderer', 'Warhammer', 'Warrior Wench', 'White Widow', 'Woe', 'HMS Gorgon', 'HM Cutter Avenger', 'HMS Destiny', 'HMS Trojan', 'HM Sloop Sparrow', 'HMS Phalarope', 'HMS Undine', 'HMS Tempest', 'HMS Hyperion', 'HMS Euryalus', 'HMS Achates', 'HMS Argonaute', 'Golden Plover', 'HMS Unrivalled', 'HMS Athena', 'HMS Onward', 'Bagheera & Akela', 'Baloo', 'Bamm-Bamm', 'Barney Rubble', 'Bart Simpson', 'Batman', 'Beavis', 'Beetle Baily', 'Betty Boop', 'Betty McBrickner Rubble', 'Bevis and Butthead', 'Bill', 'Blip', 'Blondie', 'Blossom', 'Bobby', 'Bobby Hill', 'Boo Boo', 'Boris Badenov', 'Brak', 'Breezly', 'Bubbles', 'Bullseye & Bo Peep', 'Bullwinkle', 'Butt-head', 'Buttercup', 'Buzz Lightyear', 'Calvin', "Cap'n Crunch", 'Captain America', 'Cartman', 'Casper the Friendly Ghost', 'Cat in the Hat', 'Cat Woman', 'Charlie Brown', 'Charlie Tuna', 'Chester Cheetah', 'Chief Winchley', 'Chip and Dale', 'Chopper', 'Chuck', 'Cinderella', 'Cindy Bear', 'Clifford the Big Red Dog', 'Coil Man', 'Colonel Hathi', 'Cosmo S. Spacely', 'Crush', 'Curious George', 'Dagwood', 'Daisy Duck', 'Daphne Blake', 'Darla', 'Dash', 'Dee Dee', 'Dennis the Menace', 'Dexter', 'Dick Tracy', 'Dilbert', 'Ding-A-Ling', 'Dino', 'Dino Boy', 'Dixie', 'Dora the Explorer', 'Dorno', 'Dory', 'Dr. Benton', 'Drizella & Anastasia', 'Droop-A-Long', 'Droopy the Dog', 'Duckworth the Butler', 'Dudley Dooright', 'Dumbo', 'Fairy Godmother (Cinderella)', 'Fantastic Four', 'Fat Albert', 'Felix the Cat', 'Fibber Fox', 'Flash', 'Floral Rugg', 'Fluid Man', 'Foghorn Leghorn', 'Fred "Freddie" Jones', 'Fred Flintstone', 'Fritz the cat', 'Frosty', 'Frozone', 'Francine', 'Jace', 'Jack-Jack', 'Jan', 'Jane Jetson', 'Jaq & Gus', 'Jerry', 'Jessie', 'Jet Screame', 'Joe Camel', 'Johnny Bravo', 'Jonny Quest', 'Josie McCoy', 'Judy Jetson', 'Jughead', 'Maggie Simpson', 'Magic Carpet', 'Magica De Spell', 'Magilla Gorilla', 'Mandark', 'Marge Simpson', 'Marlin', 'Marmaduke', 'Marshmallow Man', 'Marvin Martian', 'Maw Rugg', 'Melody Valentine', 'Mighty Mouse', 'Minnie Mouse', 'Mirage', 'Moby Dick', 'Mojo Jojo', 'Moo', 'Morocco Mole', 'Mowgli & Shanti', 'Mr. & Mrs. Potatohead', 'Mr. Incredible', 'Mr. Jinks', 'Mr. Kool-Aid', 'Mr. Magoo', 'Mr. Peebles', 'Mr. Peabody', 'Multi Man', 'Mushmouse', 'Muttley', 'Paw Rugg', 'Pebbles Flintstone',  'Peter Griffith', 'Peter Pan', 'Peter Potamus', 'Piglet', 'Pikachu', 'Pink Panther', 'Pinky and the Brain', 'Pixie', 'Plucky Duck', 'Pluto', 'Popeye', 'Porky Pig', 'Prince Charming', 'Princess Jasmine', 'Punkin Puss', 'Quick Draw McGraw', 'Sad Sack', "Santa's Little Helper", 'Scoobert "Scooby" Doo', 'Scooby the Seal', 'Scooby-Dee', 'Scooby-Doo', 'Scooby-Dum', 'Scrappy Doo', 'Scrooge McDuck', 'Secret Squirrel', 'Shag Rugg', 'Shaggy from the Scooby-Doo', 'Shazzan', 'Shere Khan', 'Sheriff Woody', 'Sherman', 'Slinky Dog', 'Smurfs', 'Snagglepuss', 'Snap, Crackle and Pop', 'Sneezly', 'Snidely Whiplash', 'Snoopy', 'Snuffles', 'SoSo', 'Space', 'Space Ghost', 'Speed Buggy', 'Speed Racer', 'Spiderman', 'Spike the Bulldog', 'SpongeBob SquarePants', 'Squiddly Diddly', 'Superman', 'Sylvester', 'Tara', 'T.Turanga Leela', 'Tasmanian Devil', 'The Beagle Boys', 'The Chief', 'The Great Gazoo', 'The Grinch', 'The Gruesomes', 'The Incredible Hulk', 'The Joker', 'The Professor', 'The Sultan', 'Theo', 'Tigger', 'Tom and Jerry', 'Tom Terrific', 'Tommy Pickles', 'Tony Tiger', 'Top Cat', 'Toucan Sam', 'Touch Turtle and DumDum', 'Transformers', 'Tundro', 'Tweety Bird'];
function randomShipName() {
	return names[Math.floor(Math.random()*names.length)]
}


getStationaryPoint=function(){ 
	var a=[[1.251396, 103.798431],[1.182747, 103.666595]];
	return a[Math.floor(Math.random()*a.length)];
}


function chuckPointsAtJeremy(){
	// var a=[1.212953, 103.435195]
	// return ([a[0]-Math.random()/10,a[1]+Math.random()/20])

	var a=[[1.212953, 103.435195],[1.081830, 103.637069],[1.231488, 103.866408]]
	var b=a[Math.floor(Math.random()*a.length)];
	return ([b[0]-Math.random()/10,b[1]+Math.random()/100])
}


function heading(p1,p2)
{
	return  bearing = 90 - (180/pi)*Math.atan2(p2[1]-p1[1], p2[0]-p1[0])
}


Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
}


function distance(p1,p2)
{
	lon1=p1[1]
    lat1=p1[0]
    lon2=p2[1]
    lat2=p2[0]
    // convert decimal degrees to radians 

    lon1=Math.radians(lon1)
    lat1=Math.radians(lat1)
    lon2=Math.radians(lon2)
    lat2=Math.radians(lat2)
    //haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2)
    c = 2 * Math.asin(Math.sqrt(a)) 
    m = 6367 *1000 * c
    return m
}


function checkHeading(p1,p2)
{
	if (distance(p1,p2)<2000)
		return heading(p1,p2);
	else
		return 'Happy sailing!';
}
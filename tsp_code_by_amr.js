//this will be the adjacency matrix of the problem
let adjacencyMatrix = [
    [0, 8, 13, 18, 20],
    [3, 0, 7, 8, 10],
    [4, 11, 0, 10, 7],
    [6, 6, 7, 0, 11],
    [10, 6, 2, 1, 0],
];

//Map that holds all the relationships
let map = new Map();


/*
* This function , will do the tsp algorithm & return the path + cost
* */
function TSP_algorthim(adjacencyMatrix, map) {
    printWelcomeMessege();
    let latestFormedMap = new Map();


    /*//Make a map of anything With 1 , 2_1 ,
     3_1 and so on. with the key = 2 or 3 or 4
    *
    * */
    populateFirstRelations(adjacencyMatrix, map);


    //Generate a sequence of all the number according to the matrix size
    let startingSequence = [...Array(adjacencyMatrix.length).keys()]; // 0,1,2,3,4 if (5)

    // remove the first element , main sequence will be 1,2,3,4, this sequence will be the used later on..
    let mainSequence = startingSequence.slice(1, startingSequence.length);

    let size = 0; //starting from 1 -> n

    //Loop till the size is equal to the size of the matrix-1
    while (size <= mainSequence.length) {
        for (let i of mainSequence) { //2,3,4

            //the diffirent sequence of the previous sequence
            let subSequence = getRest(i, mainSequence);//for 2 -> 3,4,5

            //each one of the subsequence...KB[i]
            let biggerList = [];

            for (let k of subSequence) { //3,4,5    //2-> 3,4,5 ,1->2,3,4
                let maps;
                maps = formPermuations(i, subSequence, k, (size));
                if (size === 0)
                    biggerList.push(maps);
                else
                    biggerList.push(...maps); //flatten them
            }

            //after this ,we can get the minim of that whole list.
            //according to each perm cost....
            //then cache it in the results... (maybe only if size>1)


            if (size === 0) {
                //Cache the value of the biggerList..... 2_3 , 2_4 and so on...
                //small list is just 2 numbers (A=1)
                for (let smallSet of biggerList) {
                    cache(smallSet, map, adjacencyMatrix);
                }
            } else {
                //Open the 2 lines ,if you want to see the content of the map building cycle by cycle
                //console.log('=====================================================================================')
                //     console.log(map)
                //size > 1      e.g:(2,3,4)
                //we need to get the  minimum of the permutations and cache it
                //this set is a bit advanced ... like '2_3_4' like => g(2,{3,4}), g(2,{4,3}...etc then get the minium
                let left = mainSequence.length - (size);//if left = 1 , then cache to upper map
                advancedCache(biggerList, map, latestFormedMap, left, adjacencyMatrix)


            }


        }


        size++;
        if (size === mainSequence.length) {
            //A(4) for example .. that means , I am done .. Now need to get the distance between
            //Each one and 1
            let finalCosts = [];
            let finalIternary = [];

            //at this level we should sth like the following already stored in latestmap
            //2,3,4,5    & 3,4,2,5    & 4,5,2,3 , 5,2,3,4
            for (let item of latestFormedMap) {
                //each item is a map [iternary, cost]
                let sequenceList = item[0].split("_"); //we get [2,3,4,5]
                let firstCost = adjacencyMatrix[0][sequenceList[0]];
                sequenceList.unshift(0); //add the first element again
                sequenceList.push(0); // add the item to the end to look like 1_2_3_4_1
                sequenceList = sequenceList.join("_");//just to reinsert it ...
                finalCosts.push(firstCost + item[1]);
                finalIternary.push(sequenceList);
                map.set(sequenceList,firstCost + item[1]);
            }
            console.log("===================================================================")

            console.log(map)

            console.log("===================================================================")
            let finalResultCostAndIndex = minValueAndIndex(finalCosts);
            console.log("The shortest Trip is :>", finalResultCostAndIndex[0]);
            console.log("The shortest Trip cost :>", finalIternary[finalResultCostAndIndex[1]]);
            return; //we reached the enf.....


        }

    }

       return [finalResultCostAndIndex[0], finalIternary[finalResultCostAndIndex[1]] ]
    //return the path + cost or print them
}


/*
* Testing....
* */
TSP_algorthim(adjacencyMatrix, map);


/*
* This function will populate the first relations
* Example :
* 2_1 => (2,costOf(2_1))
* 3_1 => (3,costOf(3_1))
* */
function populateFirstRelations(adjacencyMatrix, map) {

    //Loop of the rows Only , start from 1 because we dont want 1_1 relation
    for (let i = 1; i < adjacencyMatrix.length; i++) {
        //forming each record ....
        let key = i;
        let value = adjacencyMatrix[i][0];
        map.set(key + "", value);
    }


}


/*
* This is one of the core functions
* it should return different permutations
* of the Given size & of the elements in
* the sub sequence . & all permuations
* should not be repeated and start with the element i
* */
function formPermuations(element, otherNumbers, k, size) {
    let returnedList = [];
    //size is how many elements in each permuation
    //if other number is 3  , the size = 1 , the returened should be
    //2->3 , 2->4, 2->5


    if (size === 0) { //first part
        // it is just the element + _ and the other element K
        returnedList.push(element);
        returnedList.push(k);
        return returnedList.join('_') // result will be something like : 2_3
    } else {
        //At the first element , so later on it can be added in the permutations..
        //[2,3,4] => [2,4,3] & [2,3,4] , we only will take [2,3,4] for iteration of calling loop
        let otherNumberWithElement = [...otherNumbers];
        let all = [];

        for (let a of getAllPerms(otherNumberWithElement)) {
            a.unshift(element);
            while (a.length > size + 1)//to remove unwanted permutations.....
                a.pop();

            all.push(a.join("_"))
        }

        returnedList.push(...all);
        return returnedList;
    }


}


function printWelcomeMessege() {
    console.log("Made By Amr Aboeleneen\nAlgorithims Course\nYear-2020\n\n\nPlease notice that indeces starts from 0 not 1")
}

/*
*Given a list & item , get all items other than items
* */
function getRest(k, data) {
    let list = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== k) {
            list.push(data[i]);
        }
    }
    return list;
}


/*
* These set of functions are used to get all the permutations
* Gets an array of elements returns there permuations .
* Edit : Return only where the first element is
* */
function getAllPerms(array) {
    let myMap = new Map();
    let allPermutation = [];
    let numberOfPermuation = 0;
    let endingPermunation = factorial(array.length);


    while (numberOfPermuation !== endingPermunation) {
        let shuffled = shuffle(array);

        if (diffrentOrder(shuffled, myMap)) {
            allPermutation.push([...shuffled]);
            numberOfPermuation++;
        }
    }

    //Todo : Optimization can be added here to reduce number of permutations ...
    // let candidate = [];
    // for(let i=0;i<allPermutation.length;i++){
    //     if(allPermutation[i][1]===secondElement)
    //         candidate.push(allPermutation[i]);
    // }

    return allPermutation
}

/*
* checks if an array is inside a map or not ,using O(n) checks Only!
* */
function diffrentOrder(newArray, myMap) {
    let key = newArray.join("_");
    if (myMap.get(key) === undefined) {
        let c = [...newArray];
        myMap.set(key, c);
        return true;
    }
    return false;
}

/*
* given an array , return it shuffled.. used to generate permutations efficiently
* */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


/*
* returns the factorial , to calculate the permutations of the first levels only..
* */
function factorial(n) {
    return (n <= 0) ? 1 : n * factorial(n - 1);
}


/*
* This function takes a set such as 1_2 or 1_3 ...etc
* and calculate its cost + add it to the map
*
* */
function cache(smallSet, map, adjacencyMatrix) {
    let numbers = smallSet.split("_");
    //if the set is not found in the map , add it
    if (map.get(smallSet) === undefined) {
        let firstRange = adjacencyMatrix[numbers[0]][numbers[1]];// e.g. 2_3 calculated from Adjacency matrix
        if (firstRange === undefined)
            throw "the first range has a problem .... check the matrix";
        let secondRange = map.get(numbers[1] + "");          //3_1
        if (secondRange === undefined)
            throw "the second range was not inserted to the map before hand =P";
        let total = firstRange + secondRange;
        map.set(smallSet, total);
    } else {
        console.log("Already Inserted record...", smallSet)
    }
}


/*
* This function , should take a BiggerList such as [2,3,4] g(2,{3,4}) for sizes A=(2+)
*
* biggerList : the list of all combinations that we want to get their minimum
* map : is main map where we cache the data
* left: let us know if it is the final stage of solving (if matrix size p = 5 , A=4 is the final step, thus left=1)
* adjacency matrix : Not sure if i need it , (guess not after A = 1 )
* */
function advancedCache(biggerList, map, latestMap, left, adjMat) {
    let allCosts = [];
    let itenaries = [];
    let firstElement;
    for (let oneList of biggerList) {
        let data = oneList.split("_"); //forms an array 2,3,4
        firstElement = data.splice(0, 1); //delete the first element
        let firstRangeCost = adjMat[firstElement][data[0]]//map.get(firstElement+"_"+data[0]);//gets 2_3

        let secondRangeCost = map.get(data.join('_')); //gets 3_4
        if (secondRangeCost === undefined) {
            //result was not cached before.... thus Do not include it;not cached = > not optimum
            continue;
        }
        //saving the cost & itenery
        allCosts.push(firstRangeCost + secondRangeCost); //add costs to an array
        itenaries.push(oneList); //add iternary to an array
    }
    //it might happen that none of the permutations wasn't calculated before , thus we just ignore them because
    //if we ignored them previously that means they are not optimum .
    if (allCosts.length === 0)
        return;


    let minimumItenaryAndIndex = minValueAndIndex(allCosts);

    //Now we have to cache the result to the map
    let allNumbers = itenaries[minimumItenaryAndIndex[1]].split("_"); //since number that was minumum was without first
    allNumbers = allNumbers.join("_"); //we rejoin them with underscore
    map.set(allNumbers, minimumItenaryAndIndex[0]);
    if (left === 1) {
        latestMap.set(allNumbers, minimumItenaryAndIndex[0]);//cache to upper level ...
    }


}


/*
* Given a list , return the minimum value and the index of it as [minVal,indexOfMinVal]
* */
function minValueAndIndex(items) {
    return items.reduce((acc, val) => {
        acc[0] = (acc[0] === undefined || val <= acc[0]) ? val : acc[0];
        acc[1] = items.indexOf(acc[0]);
        return acc;
    }, []);
}

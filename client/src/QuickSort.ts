// https://en.wikipedia.org/wiki/Quicksort

// QuickSort(array, 0, array.lenth-1, compare function)
// example compare fucntion: [ i < j ] , would be: (i,j) => i-j
export default function QuickSort<T>(array: T[], low: number, high: number, compare: CompareFunction<T>) {
    if (low < high) {  //  "high - low > 0"  is possibly faster
        let part = partition(array, low, high, compare);
        QuickSort(array, low, part, compare);
        QuickSort(array, part + 1, high, compare);
    }
}

function partition<T>(array: T[], low: number, high: number, compare: CompareFunction<T>) {
    let pivotIndex = Math.floor((high + low)/2);
    let pivot = array[pivotIndex];
    let lo = low - 1;
    let hi = high+ 1;
    while(true) {
        do {
            lo += 1;
        } while (compare(array[lo], pivot) < 0)
        do {
            hi -= 1;
        } while (compare(array[hi], pivot) > 0)
        if(lo >= hi) {
            return hi;
        }
        let temp = array[lo];
        array[lo] = array[hi];
        array[hi] = temp;
    }
 }

 export type CompareFunction<T> = (t1: T, t2: T) => number;
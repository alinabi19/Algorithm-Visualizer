let bars = document.getElementsByClassName("bars");

let heights = [];
let sortStartTime;
let ahead = false;
let sorted = false;
let timeLabel = document.querySelector("#control-section #time strong");
let speedInput = document.getElementById("a_speed");
let sizeInput = document.getElementById("data_size");

const barsSize = () => sizeInput.value;
let sleepTime = () => (1 / speedInput.value) * 100;
function makeBars() {
  const container = document.getElementById("sort-container");
  container.innerHTML = "";
  for (let i = 1; i <= barsSize(); i++) {
    let iDiv = document.createElement("div");
    iDiv.className = "bars";
    container.appendChild(iDiv);
  }
}
const updateTime = (currentTime) => {
  const diff = currentTime - sortStartTime;
  const seconds = Math.floor(diff / 1000);
  const milliSeconds = diff % 1000;
  timeLabel.innerText = `${seconds}s ${milliSeconds}ms`;
};

const beforeSortStart = () => {
  if (sorted) return;
  sorted = true;
  ahead = true;
  sortStartTime = Date.now();
};

function setRandomBars() {
  makeBars();
  heights = [];
  const lengthOfBars = barsSize();
  const heightMultiplyFactor = 300 / lengthOfBars;
  for (let i = 1; i <= lengthOfBars; i++) {
    heights.push(i * heightMultiplyFactor);
  }
  timeLabel.innerText = 0;
  //Shuffle the bars
  async function shuffle(heights) {
    let currentIndex = heights.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = heights[currentIndex];
      heights[currentIndex] = heights[randomIndex];
      heights[randomIndex] = temporaryValue;
      bars[currentIndex].style.height = heights[currentIndex] + "px";
      bars[randomIndex].style.height = heights[randomIndex] + "px";
      await sleep(1);
    }

    for (let i = 0; i < bars.length; i++) {
      bars[i].style.height = heights[i];
    }
    return heights;
  }
  shuffle(heights);
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function swap(heights, first_Index, second_Index) {
  let temp = heights[first_Index];
  heights[first_Index] = heights[second_Index];
  heights[second_Index] = temp;
}

makeBars();
setRandomBars();

//BUBBLE SORT
const bubbleSort = async () => {
  beforeSortStart();
  let len = heights.length;
  for (let i = len - 1; i >= 0; i--) {
    for (let j = 1; j <= i; j++) {
      if (ahead == false) return;
      if (heights[j - 1] > heights[j]) {
        let temp = heights[j - 1];
        heights[j - 1] = heights[j];
        heights[j] = temp;
        bars[j].style.height = heights[j] + "px";
        bars[j - 1].style.height = heights[j - 1] + "px";
        await sleep(sleepTime());
        updateTime(Date.now());
      }
    }
  }
  return heights;
};

//SELECTION SORT
async function selectionSort() {
  beforeSortStart();

  let len = heights.length;
  // One by one move boundary of unsorted subarray
  for (let i = 0; i < len; i++) {
    // Find the minimum element in unsorted array
    let min_idx = i;
    for (let j = i + 1; j < len; j++) {
      if (ahead == false) return;
      if (heights[j] < heights[min_idx]) {
        min_idx = j;
      }
    }

    // Swap the found minimum element with the first element
    if (min_idx != i) {
      let temp = heights[min_idx];
      heights[min_idx] = heights[i];
      heights[i] = temp;

      bars[i].style.height = heights[i] + "px";
      bars[min_idx].style.height = heights[min_idx] + "px";
      await sleep(sleepTime());
      updateTime(Date.now());
    }
  }
  return heights;
}

// QUICKSORT
async function quickSort(left = 0, right = heights.length - 1) {
  beforeSortStart();

  let index;
  if (heights.length > 1) {
    let pivot = heights[Math.floor((right + left) / 2)]; //middle element
    const i = left; //left pointer
    const j = right; //right pointer
    while (i <= j) {
      if (ahead == false) return;
      while (heights[i] < pivot) {
        if (ahead == false) return;
        i++;
      }
      while (heights[j] > pivot) {
        if (ahead == false) return;
        j--;
      }
      if (i <= j) {
        swap(heights, i, j); //sawpping two elements
        bars[i].style.height = heights[i] + "px";
        bars[j].style.height = heights[j] + "px";
        await sleep(sleepTime());
        i++;
        j--;
      }
    }

    index = i;
    if (left < index - 1) {
      //more elements on the left side of the pivot
      quickSort(left, index - 1);
    }
    if (index < right) {
      //more elements on the right side of the pivot
      quickSort(index, right);
    }
  }
}

// INSERTION SORT
async function insertionSort() {
  beforeSortStart();

  let i,
    len = heights.length,
    el,
    j;

  for (i = 1; i < len; i++) {
    el = heights[i];
    j = i;

    while (j > 0 && heights[j - 1] > el) {
      if (ahead == false) return;
      heights[j] = heights[j - 1];
      bars[j].style.height = heights[j] + "px";
      await sleep(sleepTime());

      j--;
    }

    heights[j] = el;
    bars[j].style.height = heights[j] + "px";
    await sleep(sleepTime());
    updateTime(Date.now());
  }

  return heights;
}

// RADIX SORT
async function radixSort() {
  beforeSortStart();

  let counter = [[]];
  let max = 0,
    mod = 10,
    dev = 1; //max
  for (let i = 0; i < heights.length; i++) {
    if (ahead == false) return;
    if (heights[i] > max) {
      max = heights[i];
    }
  }
  // determine the large item length
  let maxDigitLength = (max + "").length;
  for (let i = 0; i < maxDigitLength; i++, dev *= 10, mod *= 10) {
    for (let j = 0; j < heights.length; j++) {
      if (ahead == false) return;
      let bucket = Math.floor((heights[j] % mod) / dev); // Formula to get the significant digit
      if (counter[bucket] == undefined) {
        counter[bucket] = [];
      }
      counter[bucket].push(heights[j]);
    }
    let pos = 0;
    for (let j = 0; j < counter.length; j++) {
      let value = undefined;
      if (counter[j] != undefined) {
        while ((value = counter[j].shift()) != undefined) {
          if (ahead == false) return;
          heights[pos++] = value;
          //console.log(heights[pos - 1]);
          bars[pos - 1].style.height = heights[pos - 1] + "px";
          await sleep(sleepTime());
          updateTime(Date.now());
        }
      }
    }
  }
}

//MERGE SORT
async function mergeSort() {
  beforeSortStart();
  let n = heights.length;
  for (curr_size = 1; curr_size <= n - 1; curr_size = 2 * curr_size) {
    // Pick starting point of different subarrays of current size
    for (left_start = 0; left_start < n - 1; left_start += 2 * curr_size) {
      // Find ending point of left subarray. mid+1 is starting
      // point of right
      let a = left_start + curr_size - 1;
      let b = n - 1;
      let mid = a < b ? a : b;
      //let mid = min(left_start + curr_size - 1, n-1);
      a = left_start + 2 * curr_size - 1;
      b = n - 1;
      let right_end = a < b ? a : b;
      //let right_end = min(left_start + 2*curr_size - 1, n-1);

      let l = left_start;
      let m = mid;
      let r = right_end;
      let i, j, k;
      let n1 = m - l + 1;
      let n2 = r - m;

      /* create temp arrays */
      let L = new Array(n1);
      let R = new Array(n2);

      /* Copy data to temp arrays L[] and R[] */
      for (i = 0; i < n1; i++) L[i] = heights[l + i];
      for (j = 0; j < n2; j++) R[j] = heights[m + 1 + j];

      /* Merge the temp arrays back into heights[l..r]*/
      i = 0;
      j = 0;
      k = l;
      while (i < n1 && j < n2) {
        if (ahead == false) return;
        if (L[i] <= R[j]) {
          heights[k] = L[i];
          bars[k].style.height = heights[k] + "px";
          await sleep(5);
          i++;
        } else {
          heights[k] = R[j];
          bars[k].style.height = heights[k] + "px";
          await sleep(sleepTime());
          j++;
        }
        k++;
      }

      /* Copy the remaining elements of L[], if there are any */
      while (i < n1) {
        if (ahead == false) return;
        heights[k] = L[i];
        bars[k].style.height = heights[k] + "px";
        await sleep(sleepTime());
        updateTime(Date.now());
        i++;
        k++;
      }

      /* Copy the remaining elements of R[], if there are any */
      while (j < n2) {
        if (ahead == false) return;
        heights[k] = R[j];
        bars[k].style.height = heights[k] + "px";
        await sleep(sleepTime());
        j++;
        k++;
      }
    }
  }
}

async function shuffle() {
  ahead = false;
  sorted = false;
  await setRandomBars();
}

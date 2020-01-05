export const quickSort = (inputArray, sortParam, sortDir) => {
  if (inputArray.length <= 1) {
    return inputArray;
  }
  const left = [];
  const right = [];
  const newArray = [];
  const pivot = inputArray.pop();
  const { length } = inputArray;

  if (sortDir === 'falling') {
    for (let i = 0; i < length; i++) {
      if (sortParam === 'date') {
        if (inputArray[i].publishDate.getTime() >= pivot.publishDate.getTime()) {
          left.push(inputArray[i]);
        } else {
          right.push(inputArray[i]);
        }
      } else if (sortParam === 'type') {
        if (inputArray[i].doctype >= pivot.doctype) {
          left.push(inputArray[i]);
        } else if (inputArray[i].doctype === pivot.doctype) {
          if (inputArray[i].publishDate >= pivot.publishDate) {
            left.push(inputArray[i]);
          } else {
            right.push(inputArray[i]);
          }
        } else {
          right.push(inputArray[i]);
        }
      } else if (sortParam === 'alphabetical') {
        if (inputArray[i].headingText >= pivot.headingText) {
          left.push(inputArray[i]);
        } else {
          right.push(inputArray[i]);
        }
      } else if (inputArray[i].publisher >= pivot.publisher) {
        left.push(inputArray[i]);
      } else {
        right.push(inputArray[i]);
      }
    }
  } else {
    for (let j = 0; j < length; j++) {
      if (sortParam === 'date') {
        if (inputArray[j].publishDate.getTime() <= pivot.publishDate.getTime()) {
          left.push(inputArray[j]);
        } else {
          right.push(inputArray[j]);
        }
      } else if (sortParam === 'type') {
        if (inputArray[j].doctype <= pivot.doctype) {
          left.push(inputArray[j]);
        } else if (inputArray[j].doctype === pivot.doctype) {
          if (inputArray[j].publishDate >= pivot.publishDate) {
            left.push(inputArray[j]);
          } else {
            right.push(inputArray[j]);
          }
        } else {
          right.push(inputArray[j]);
        }
      } else if (sortParam === 'alphabetical') {
        if (inputArray[j].headingText <= pivot.headingText) {
          left.push(inputArray[j]);
        } else {
          right.push(inputArray[j]);
        }
      } else if (inputArray[j].publisher <= pivot.publisher) {
        left.push(inputArray[j]);
      } else {
        right.push(inputArray[j]);
      }
    }
  }

  return newArray.concat(quickSort(left, sortParam, sortDir), pivot, quickSort(right, sortParam, sortDir));
};

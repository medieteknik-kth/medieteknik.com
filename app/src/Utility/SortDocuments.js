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
      } else if (sortParam === 'alphabetical') {
        if (inputArray[i].headingText.toUpperCase() >= pivot.headingText.toUpperCase()) {
          left.push(inputArray[i]);
        } else {
          right.push(inputArray[i]);
        }
      } else if (inputArray[i].publisher.toUpperCase() >= pivot.publisher.toUpperCase()) {
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
      } else if (sortParam === 'alphabetical') {
        if (inputArray[j].headingText.toUpperCase() <= pivot.headingText.toUpperCase()) {
          left.push(inputArray[j]);
        } else {
          right.push(inputArray[j]);
        }
      } else if (inputArray[j].publisher.toUpperCase() <= pivot.publisher.toUpperCase()) {
        left.push(inputArray[j]);
      } else {
        right.push(inputArray[j]);
      }
    }
  }

  return newArray.concat(quickSort(left, sortParam, sortDir), pivot, quickSort(right, sortParam, sortDir));
};
